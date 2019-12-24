const ONE_MINUTE = 60
const ONE_HOUR = ONE_MINUTE * 60

const workers = [
  {
    name: 'heartbeat',
    path: './src/workers/heartbeat',
    processes: 1,
    times: 0,
    tries: 3,
    repeat: ONE_HOUR,
  },
  {
    name: 'reveal',
    path: './src/workers/reveal',
    processes: 1,
    times: 0,
    tries: 3,
    repeat: ONE_MINUTE,
  },
  {
    name: 'disputes',
    path: './src/workers/disputes',
    processes: 1,
    times: 0,
    tries: 3,
    repeat: ONE_MINUTE,
  },
  {
    name: 'settlements',
    path: './src/workers/settlements',
    processes: 1,
    times: 0,
    tries: 3,
    repeat: ONE_MINUTE * 5,
  },
]

export {
  workers
}
