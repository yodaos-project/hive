var hive = require('../../lib/hive')

console.log('# on fork', process.hrtime())
var pid = hive.fork(__dirname, ['../children/alive'])
if (pid > 0) {
  process.on('SIGTERM', () => {
    process.kill(pid)
    process.exit()
  })
}
