# Court Backend services

This repo provides a set of background services in charge of those parts of Aragon Court that can be done automatically to ensure a good user experience for the users of the court.

## Workers

It provides the following list of worker services:
- [`Heartbeat`](./src/workers/heartbeat.js): It will try to update the court in case it is outdated. Configured initially to run one time per hour indefinitely.
- [`Reveals`](./src/workers/reveal.js): It will try to execute all the reveals requested by the users. Configured initially to run one time per minute indefinitely.
- [`Disputes`](./src/workers/disputes.js): It will scan the Ethereum blockchain looking for new created disputes that will serve the `settlements` worker afterward. Configured initially to run one time every 5 minutes indefinitely.
- [`Settlements`](./src/workers/settlements.js): It will try to execute and settle penalties, rewards, and appeals for all the rounds of a dispute if possible. Configured initially to run one time per minute indefinitely.

## Setup

First clone this repo and install dependencies:

````bash
git clone https://github.com/aragonone/court-backend/
cd court-backend
npm i
npx lerna bootstrap
````

The services will use the same database required by the backend server, so follow the instructions there to set up and run that database.

Then run the background services as follows:

```bash
cd court-backend/packages/services
PRIVATE_KEY=0x... npm start
```

## Config

### Workers

All the background services are configured through the `config.js` file using the following variables:
- `name`: Name of the worker used for logging. It will assume `unknown` if undefined.
- `path`: Name of the root file that will be executed every time a new job for that worker is executed. This parameter is mandatory, and it must be a file exporting an async function accepting the following list of parameters: `worker`, `job`, `tries`, `logger`.
- `processes`: Number of workers run in parallel. It will assume `1` if undefined.
- `times`: Number of jobs that will be run for each worker, use `0` to denote unlimited. It will assume `1` if undefined.
- `repeat`: The number of seconds that the worker will wait until a new job is created. It will assume `0` if undefined.
- `prefixColor`: Color used for the prefix when logging to the console

### Ethereum private key

This repo needs the private key to be defined as a envrionment variable `PRIVATE_KEY`. You can manually `export` it before launching the services or define it in the `.env` file.
