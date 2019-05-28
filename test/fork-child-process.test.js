var assert = require('assert')
var helper = require('./helper')
var hive = require('../lib/hive')

var SIGINT = 2
var pid

hive.onExit(helper.mustCall((_pid, code, signal) => {
  assert.strictEqual(_pid, pid)
  assert.strictEqual(code, 0)
  assert.strictEqual(signal, SIGINT)
  hive.stop()
}))

pid = hive.fork(__dirname, ['./children/alive'])
if (pid > 0) {
  setTimeout(() => {
    process.kill(pid, SIGINT)
  }, 2000)
}
