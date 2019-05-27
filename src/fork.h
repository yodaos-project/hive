#pragma once

#define NODE_ADDON_API_DISABLE_DEPRECATED
#define NAPI_EXPERIMENTAL
#define NAPI_VERSION 4
#include "napi.h"
#include <stdlib.h>
#include <unistd.h>
#include <sys/errno.h>

Napi::Value Fork(const Napi::CallbackInfo& info);
