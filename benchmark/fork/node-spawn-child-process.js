var childProcess = require('child_process')

console.log('# on fork', process.hrtime())
var cp = childProcess.spawn(process.argv[0], ['../children/alive'], { cwd: __dirname, stdio: 'inherit' })
process.on('SIGTERM', () => {
  cp.kill()
  process.exit()
})
