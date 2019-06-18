console.log('# on child', process.hrtime())
setInterval(() => {
  console.log('Still alive')
}, 1000)
