var childProcess = require('child_process')

console.log('# on fork', process.hrtime())
var cp = childProcess.fork('../children/require-lodash', [], { cwd: __dirname, stdio: 'inherit' })
process.on('SIGTERM', () => {
  cp.kill()
  process.exit()
})
