cmake_minimum_required(VERSION 3.0)
project(yoda-hive CXX)
set(CMAKE_CXX_STANDARD 11)

find_package(NodeAddon REQUIRED)

add_node_addon(${PROJECT_NAME} SOURCES src/hive.cc)
