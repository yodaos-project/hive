#include "fork.h"

using namespace std;

// Initialize native add-on
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "fork"), Napi::Function::New(env, Fork));
  return exports;
}

// Register and initialize native add-on
NODE_API_MODULE(Fork, Init);

Napi::Value Fork(const Napi::CallbackInfo& info) {
  auto env = info.Env();
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
    return Napi::Number::New(env, pid);
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
