const ONE_MINUTE = 60
const ONE_HOUR = ONE_MINUTE * 60

const workers = [
  {
    name: 'heartbeat',
    prefixColor: 'yellow',
    path: './src/workers/heartbeat',
    processes: 1,
    times: 0,
    tries: 3,
    repeat: ONE_HOUR,
  },
  {
    name: 'reveal',
    prefixColor: 'blue',
    path: './src/workers/reveal',
    processes: 1,
    times: 0,
    tries: 3,
    repeat: ONE_MINUTE,
  },
  {
    name: 'disputes',
    prefixColor: 'pink',
    path: './src/workers/disputes',
    processes: 1,
    times: 0,
    tries: 3,
    repeat: ONE_MINUTE,
  },
  {
    name: 'settlements',
    prefixColor: 'cyan',
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
