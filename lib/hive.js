var path = require('path')
var native = require('../build/Release/hive.node')

var onExitCallback
native.onChildExit((pid, code, signal) => {
  onExitCallback(pid, code, signal)
})

module.exports.fork = fork
module.exports.onExit = onExit
module.exports.stop = native.stop

/**
 *
 * @param {string} cwd
 * @param {string[]} argv
 * @param {{[name: string]: string}} environs
 */
function fork (cwd, argv, environs) {
  var pid = native.fork(process)
  if (pid === 0) {
    forkMain(cwd, argv, environs)
  }
  return pid
}

/**
 *
 * @param {(pid: number, status: number) => void} cb
 */
function onExit (cb) {
  onExitCallback = cb
}

function forkMain (cwd, argv, environs) {
  process.chdir(cwd)
  process.argv = process.argv.slice(0, 1)
  if (Array.isArray(argv)) {
    process.argv = argv.concat(argv)
  }
  process.env = Object.assign(process.env, environs)
  if (argv[0]) {
    var target = path.resolve(cwd, argv[0])
    console.log('loading ', target)
    require(target)
  }
}
