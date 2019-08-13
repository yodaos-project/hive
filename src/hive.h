#pragma once

#define NODE_ADDON_API_DISABLE_DEPRECATED
#define NAPI_EXPERIMENTAL
#define NAPI_VERSION 4
#include "napi.h"
#include "uv.h"
#include "node.h"

Napi::Value Fork(const Napi::CallbackInfo& info);
Napi::Value Kill(const Napi::CallbackInfo& info);
Napi::Value OnChildExit(const Napi::CallbackInfo& info);
Napi::Value Stop(const Napi::CallbackInfo& info);
void hive__chld(uv_signal_t* handle, int signal);
