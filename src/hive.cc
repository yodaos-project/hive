#include "hive.h"
#include <stdlib.h>
#include <unistd.h>
#include <list>
#include <sys/errno.h>
#include <sys/wait.h>

using namespace std;

// Initialize native add-on
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "fork"), Napi::Function::New(env, Fork));
  exports.Set(Napi::String::New(env, "kill"), Napi::Function::New(env, Kill));
  exports.Set(Napi::String::New(env, "onChildExit"), Napi::Function::New(env, OnChildExit));
  exports.Set(Napi::String::New(env, "stop"), Napi::Function::New(env, Stop));
  return exports;
}

// Register and initialize native add-on
NODE_API_MODULE(Hive, Init);

static Napi::FunctionReference onexit;
static std::list<pid_t> children;

static bool signal_listened = false;
static uv_signal_t signal_handler;

Napi::Value Fork(const Napi::CallbackInfo& info) {
  auto env = info.Env();

  uv_loop_t* loop;
  napi_get_uv_event_loop(napi_env(env), &loop);

  auto process = info[0].As<Napi::Object>();
  auto pid = fork();
  if (pid < 0) {
    char msg[100];
    snprintf(msg, 100, "Unexpected errno(%d)", errno);
    Napi::Error::New(env, msg).ThrowAsJavaScriptException();
    return env.Undefined();
  }
  if (pid > 0) {
    /** parent process */
    children.push_back(pid);
    return Napi::Number::New(env, pid);
  }
  onexit.Reset();
  /** prevent information been leaked to child processes */
  children.empty();
  /** reinitialize uv loop */
  uv_loop_fork(loop);

  if (signal_listened) {
    uv_signal_stop(&signal_handler);
    signal_listened = false;
  }
  /** child process */
  auto pidDescriptor =
      Napi::PropertyDescriptor::Value("pid",
                                Napi::Number::New(env, getpid()),
                                napi_property_attributes(napi_enumerable | napi_configurable));
  auto ppidDescriptor =
      Napi::PropertyDescriptor::Value("ppid",
                                Napi::Number::New(env, getppid()),
                                napi_property_attributes(napi_enumerable | napi_configurable));
  process.DefineProperties({ pidDescriptor, ppidDescriptor });
  return Napi::Number::New(env, 0);
}

Napi::Value Kill(const Napi::CallbackInfo& info) {
  auto env = info.Env();
  int pid = info[0].As<Napi::Number>().Int32Value();
  int signal = info[1].As<Napi::Number>().Int32Value();
  int status = uv_kill(pid, signal);
  return Napi::Number::New(env, status);
}

Napi::Value OnChildExit(const Napi::CallbackInfo& info) {
  auto env = info.Env();
  auto cb = info[0].As<Napi::Function>();
  onexit.Reset(cb, 1);

  uv_loop_t* loop;
  napi_get_uv_event_loop(napi_env(env), &loop);
  uv_signal_init(loop, &signal_handler);
  uv_signal_start(&signal_handler, hive__chld, SIGCHLD);
  signal_listened = true;

  return env.Undefined();
}

Napi::Value Stop(const Napi::CallbackInfo& info) {
  auto env = info.Env();
  uv_signal_stop(&signal_handler);
  onexit.Reset();
  signal_listened = false;

  for (auto it = children.cbegin(); it != children.cend(); it++) {
    kill(*it, SIGKILL);
  }
  return env.Undefined();
}

void hive__chld(uv_signal_t* handle, int signal) {
  pid_t pid;
  int status;
  int exit_status;
  int term_signal;

  if (onexit.IsEmpty()) {
    return;
  }

  for (auto it = children.cbegin(); it != children.cend(); it++) {
    do
      pid = waitpid(*it, &status, WNOHANG);
    while (pid == -1 && errno == EINTR);

    if (pid == 0)
      continue;

    if (pid == -1) {
      if (errno != ECHILD)
        abort();
      continue;
    }

    exit_status = 0;
    if (WIFEXITED(status))
      exit_status = WEXITSTATUS(status);

    term_signal = 0;
    if (WIFSIGNALED(status))
      term_signal = WTERMSIG(status);

    auto env = onexit.Env();
    Napi::HandleScope scope(env);
    onexit.MakeCallback(onexit.Env().Global(), {
      Napi::Number::New(env, pid),
      Napi::Number::New(env, exit_status),
      Napi::Number::New(env, term_signal)});
  }
}
