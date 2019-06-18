const childProcess = require('child_process')
const readline = require('readline')
const path = require('path')
const fs = require('fs')
const NS_PER_SEC = 1e9
const NS_PER_MSEC = 1e6

function runOnce (argv0, script) {
  const cp = childProcess.spawn(argv0, [ script ], { cwd: __dirname, stdio: 'pipe' })
  const rl = readline.createInterface(cp.stdout)
  let onFork
  let onChild

  return new Promise((resolve) => {
    rl.on('line', line => {
      let matched = line.match(/^# on fork \[\s?(\d+),\s?(\d+)\s?\]/)
      if (matched) {
        onFork = [ Number(matched[1]), Number(matched[2]) ]
      }

      matched = line.match(/^# on child \[\s?(\d+),\s?(\d+)\s?\]/)
      if (matched) {
        onChild = [ Number(matched[1]), Number(matched[2]) ]
      }

      if (onFork && onChild) {
        cp.kill()
        end()
      }
    })

    function end () {
      const consumed = zip(onChild, onFork).map(it => it[0] - it[1])
      if (consumed[1] < 0) {
        consumed[0] -= 1
        consumed[1] += NS_PER_SEC
      }
      resolve(consumed)
    }
  })
}

async function runOneBench (program, bench, n = 100) {
  let result
  for (let times = 0; times < n; ++times) {
    const rc = await runOnce(program, bench)
    if (result == null) {
      result = rc
    } else {
      result = zip(result, rc).map(it => (it[0] + it[1]) / 2)
    }
  }
  return { n, result }
}

function zip (arra, arrb) {
  return arra.map((it, idx) => [ it, arrb[idx] ])
}

async function main () {
  const suite = process.argv[2]
  const benches = fs.readdirSync(path.join(__dirname, suite))
    .map(it => path.join(__dirname, suite, it))
  const program = process.argv[3] || 'node'
  console.log(`using '${program}' as runtime...`)
  for (const bench of benches) {
    const report = await runOneBench(program, bench)
    console.log(`${bench.substring(__dirname.length + 1)} n=${report.n}: ${report.result[1] / NS_PER_MSEC}ms`)
  }
}

main()
