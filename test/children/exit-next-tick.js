var exitCode = Number(process.argv[2])
if (!Number.isInteger(exitCode)) {
  process.abort()
}
process.nextTick(() => {
  process.exit(exitCode)
})
