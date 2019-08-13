var native = process.iotjs ? require('../out/yoda-hive.node') : require('../build/Release/hive.node')
var moduleNotFoundRE = /^Module not found:/
var resolve = process.iotjs
  ? function resolve (id, options) {
    var paths = [ process.cwd() ]
    if (options && options.paths) {
      paths = options.paths
    }
    var path = require('path')
    if (path.isAbsolute(id)) {
      return id
    }
    for (var idx in paths) {
      var it = paths[idx]
      var pp = path.resolve(it, id)
      try {
        require(pp)
        return pp
      } catch (e) {
        if (!moduleNotFoundRE.test(e.message)) {
          throw e
        }
      }
    }
    throw new Error('Module not found')
  }
  : require.resolve

var onExitCallback
native.onChildExit((pid, code, signal) => {
  onExitCallback(pid, code, signal)
})

module.exports.fork = fork
module.exports.kill = native.kill
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
 * @param {(pid: number, code: number, signal: number) => void} cb
 */
function onExit (cb) {
  onExitCallback = cb
}

function forkMain (cwd, argv, environs) {
  process.chdir(cwd)
  process.argv = process.argv.slice(0, 1)
  if (Array.isArray(argv)) {
    process.argv = process.argv.concat(argv)
  }
  process.env = Object.assign(process.env, environs)
  if (argv[0]) {
    var target = resolve(argv[0], { paths: [ cwd ] })
    process.argv[1] = target
    process.title = `${process.argv[0]} ${target}`
    require(target)
  }
}
