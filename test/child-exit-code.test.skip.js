var assert = require('assert')
var helper = require('./helper')

var hive = require('../lib/hive')

var parent = process.pid
var pid
hive.onExit(helper.mustCall((_pid, code, signal) => {
  console.log(pid, code, signal)
  assert.strictEqual(_pid, pid)
  assert.strictEqual(code, 2)
  assert.strictEqual(signal, 0)
  hive.stop()
}, parent))

pid = hive.fork(__dirname, ['./children/exit-next-tick', '2'])
