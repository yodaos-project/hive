var assert = require('assert')
var hive = require('../lib/hive')

var SIGINT = 2
var pid

hive.onExit((_pid, code, signal) => {
  assert.strictEqual(_pid, pid)
  assert.strictEqual(code, 0)
  assert.strictEqual(signal, SIGINT)
  hive.stop()
})

pid = hive.fork(__dirname, ['children/alive'])
assert.ok(pid > 0, 'should fork child process')
if (pid > 0) {
  process.kill(pid, SIGINT)
}
