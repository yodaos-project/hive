var childProcess = require('child_process')

console.log('# on fork', process.hrtime())
var cp = childProcess.fork('../children/alive.js', [], { cwd: __dirname, stdio: 'inherit' })
process.on('SIGTERM', () => {
  cp.kill()
  process.exit()
})
