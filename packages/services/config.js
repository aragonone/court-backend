const ONE_MINUTE = 60
const ONE_HOUR = ONE_MINUTE * 60 * 24

const workers = [
  {
    name: 'heartbeat',
    path: './src/workers/heartbeat',
    processes: 1,
    times: 0,
    tries: 3,
    repeat: ONE_HOUR,
  },
]

export {
  workers
}
