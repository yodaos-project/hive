cmake_minimum_required(VERSION 3.0)
project(yoda-hive CXX)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/cmake;${CMAKE_MODULE_PATH}")

find_package(NodeAddon REQUIRED)
include(cmake/node-addon-api.cmake)

add_node_addon(${PROJECT_NAME} SOURCES src/hive.cc)
target_link_libraries(${PROJECT_NAME} node-addon-api)

if(CMAKE_INSTALL_PREFIX_INITIALIZED_TO_DEFAULT)
  set(CMAKE_INSTALL_PREFIX "/usr/lib/hive" CACHE PATH "..." FORCE)
endif()
install(TARGETS ${PROJECT_NAME} DESTINATION "${CMAKE_INSTALL_PREFIX}/out")
install(DIRECTORY lib DESTINATION "${CMAKE_INSTALL_PREFIX}")
install(FILES package.json DESTINATION "${CMAKE_INSTALL_PREFIX}")
