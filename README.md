# Hive

[![Build Status](https://travis-ci.com/yodaos-project/hive.svg?branch=master)](https://travis-ci.com/yodaos-project/hive)
[![License](https://img.shields.io/badge/licence-apache%202.0-green.svg)](LICENSE.md)

## Benchmarks

Following results were ran on a MacBook Pro (13-inch, 2017, Two Thunderbolt 3 ports) with 2.5 GHz Intel Core i7, 16 GB 2133 MHz LPDDR3.

### Node.js

- fork/hive-fork-child-process.js n=100: 7.649900981841598ms
- fork/node-fork-child-process.js n=100: 46.94695102435441ms
- fork/node-spawn-child-process.js n=100: 42.67337671217151ms

### ShadowNode

- fork/hive-fork-child-process.js n=100: 2.8637968484439638ms
- fork/node-fork-child-process.js n=100: 36.56608570031542ms
- fork/node-spawn-child-process.js n=100: 25.79720607225852ms
