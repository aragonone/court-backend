const ONE_MINUTE = 60
const ONE_HOUR = ONE_MINUTE * 60 * 24

const workers = [
  {
    name: 'heartbeat',
    path: './src/workers/heartbeat',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
  },
  {
    name: 'reveal',
    path: './src/workers/reveal',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
  },
  {
    name: 'rewards',
    path: './src/workers/settle-jurors',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
  },
  {
    name: 'penalties',
    path: './src/workers/settle-penalties',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
  },
  {
    name: 'appeals',
    path: './src/workers/settle-appeals',
    processes: 1,
    times: 0,
    repeat: ONE_MINUTE,
  },
]

export {
  workers
}
