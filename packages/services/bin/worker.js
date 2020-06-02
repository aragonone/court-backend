#! /usr/bin/env node

import path from 'path'
import Logger from '../src/helpers/worker-logger'
import MetricsReporter from '../src/helpers/metrics-reporter'
import errorHandler from '../src/helpers/error-handler'
import sleep from '@aragonone/court-backend-shared/helpers/sleep'

let [workerPath, name, times, repeat, color, metricsPort] = process.argv.slice(2)
if (!workerPath) throw Error('Cannot start worker with missing path')
if (name === undefined) name = 'unknown'

times = (times === undefined) ? 1 : parseInt(times)
repeat = (repeat === undefined) ? 0 : parseInt(repeat)
color = (color === undefined) ? 'white' : color

Logger.setDefaults(false, true)

const logger = Logger(name, color)
const metrics = new MetricsReporter(name, metricsPort)
const ctx = { logger, metrics }
const worker = require(path.resolve(process.cwd(), workerPath)).default

async function run() {
  logger.info(`Starting worker, will run ${times == 0 ? 'infinite' : times} jobs`)
  for (let job = 1; job !== times; job++) {
    try {
      logger.job = job
      logger.info(`Creating job #${job}`)
      metrics.workerRun()
      await worker(ctx)
      metrics.workerSuccess()
      const minutes = job === times ? 0 : repeat / 60
      logger.success(`Job #${job} finished successfully${minutes > 0 ? `, will get back in ${minutes} minutes` : ''}`)
    } catch (error) {
      metrics.workerError()
      logger.error(`Job #${job} exited with an error`, error)
    }
    await sleep(repeat)
  }
  logger.success(`Worker finished`)
}

run()
  .then(() => process.exit(0))
  .catch(errorHandler)
