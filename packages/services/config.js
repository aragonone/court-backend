const ONE_MINUTE = 60

const workers = [
  {
    name: 'heartbeat',
    color: 'yellow',
    path: './src/workers/heartbeat',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE * 10,
  },
  {
    name: 'reveal',
    color: 'pink',
    path: './src/workers/reveal',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
  },
  {
    name: 'settlements',
    color: 'cyan',
    path: './src/workers/settlements',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE * 5,
  },
  {
    name: 'monitor-keeper',
    color: 'green',
    path: './src/workers/monitor-keeper',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE * 30,
  },
]

export {
  workers
}
