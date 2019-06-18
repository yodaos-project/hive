# Hive

[![Build Status](https://travis-ci.com/yodaos-project/hive.svg?branch=master)](https://travis-ci.com/yodaos-project/hive)
[![License](https://img.shields.io/badge/licence-apache%202.0-green.svg)](LICENSE.md)

## Benchmarks

Following results were ran on a MacBook Pro (13-inch, 2017, Two Thunderbolt 3 ports) with 2.5 GHz Intel Core i7, 16 GB 2133 MHz LPDDR3.

### Node.js v12.4.0

- fork/hive-fork-child-process.js n=100: 7.649900981841598ms
- fork/node-fork-child-process.js n=100: 46.94695102435441ms
- fork/node-spawn-child-process.js n=100: 42.67337671217151ms

- require-lodash/hive-fork-child-process.js n=100: 8.122591648174616ms
- require-lodash/node-fork-child-process.js n=100: 59.44227485495386ms
- require-lodash/node-spawn-child-process.js n=100: 57.76666079101686ms
