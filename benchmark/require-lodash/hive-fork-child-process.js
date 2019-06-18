require('lodash')
var hive = require('../../lib/hive')

console.log('# on fork', process.hrtime())
var pid = hive.fork(__dirname, ['../children/require-lodash'])
if (pid > 0) {
  process.on('SIGTERM', () => {
    process.kill(pid)
    process.exit()
  })
}
