module.exports.mustCall = mustCall
function mustCall (callback) {
  var stack = new Error().stack
  var called = false
  process.on('exit', () => {
    if (!called) {
      var err = new Error('Callback was not called')
      err.stack = stack
      throw err
    }
  })

  return function wrap () {
    called = true
    callback.apply(this, arguments)
  }
}
