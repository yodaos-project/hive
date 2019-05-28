module.exports.mustCall = mustCall
function mustCall (callback) {
  var stack = new Error().stack
  var called = false
  var pid = process.pid
  process.on('exit', () => {
    if (process.pid !== pid) {
      return
    }
    if (!called) {
      var err = new Error(`Callback was not called on process(${pid})`)
      err.stack = stack
      throw err
    }
  })

  return function wrap () {
    called = true
    callback.apply(this, arguments)
  }
}
