const ONE_MINUTE = 60
const ONE_HOUR = ONE_MINUTE * 60

const workers = [
  {
    name: 'heartbeat',
    color: 'yellow',
    path: './src/workers/heartbeat',
    processes: 1,
    times: 0,
    repeat: ONE_HOUR,
  },
  {
    name: 'reveal',
    prefixColor: 'pink',
    path: './src/workers/reveal',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
  },
  {
    name: 'settlements',
    prefixColor: 'cyan',
    path: './src/workers/settlements',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE * 5,
  },
  {
    name: 'monitor-keeper',
    prefixColor: 'green',
    path: './src/workers/monitor-keeper',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
  },
]

export {
  workers
}
