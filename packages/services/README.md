# Court Backend services

This repo provides a set of background services in charge of those parts of Aragon Court that can be done automatically to ensure a good user experience for the users of the court.

### Setup

To work locally, simply go to the root directory, and make sure you have set up a propoer `.env` file following the `.env.sample` file.
Once you have done that, spin up a docker container with:
```bash
docker-compose build
docker-compose up -d
```

### Workers

It provides the following list of worker services:
- [`Heartbeat`](./src/workers/heartbeat.js): It will try to update the court in case it is outdated. Configured initially to run one time per hour indefinitely.
- [`Monitor Keeper`](./src/workers/monitor-keeper.js): Loops over all the transactions sent from the keeper address looking for suspicious transactions to report them.
- [`Notification Scanner`](./src/workers/notification-scanner.js): Loops over all notification scanner objects and inserts a notification DB entry for every email that should be sent. Runs every minute.
- [`Notification Sender`](./src/workers/notification-sender.js): Loops over all unprocessed notification DB entries and sends an associated email. Runs every 5 minutes.
- [`Reveals`](./src/workers/reveal.js): It will try to execute all the reveals requested by the users. Configured initially to run one time per minute indefinitely.
- [`Settlements`](./src/workers/settlements.js): It will try to execute and settle penalties, rewards, and appeals for all the rounds of a dispute if possible. Configured initially to run one time per five minutes indefinitely.
- [`Contract Monitor`](./src/workers/contract-monitor.js): It periodically queries court address for any failing transactions in the past 24 hours and renders Prometheus gauge metrics that can be used for alerting.

All the background services are configured through the `config.js` file using the following variables:
- `name`: Name of the worker used for logging. It will assume `unknown` if undefined.
- `path`: Name of the root file that will be executed every time a new job for that worker is executed. This parameter is mandatory, and it must be a file exporting an async function accepting the following list of parameters: `worker`, `job`, `logger`.
- `processes`: Number of workers run in parallel. It will assume `1` if undefined.
- `times`: Number of jobs that will be run for each worker, use `0` to denote unlimited. It will assume `1` if undefined.
- `repeat`: The number of seconds that the worker will wait until a new job is created. It will assume `0` if undefined.
- `color`: Color used for the prefix when logging to the console
- `metricsPort`: Port that should be used for Prometheus metrics.

### Keys

This repo needs the private key to be defined as a envrionment variable `PRIVATE_KEY`. 
