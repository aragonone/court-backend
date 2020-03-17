#! /usr/bin/env node

import path from 'path'
import errorHandler from '../src/helpers/error-handler'
import sleep from '@aragonone/court-backend-shared/helpers/sleep'
import Logger from '@aragonone/court-backend-shared/helpers/logger'

let [workerPath, name, times, repeat, prefixColor] = process.argv.slice(2)
if (!workerPath) throw Error('Cannot start worker with missing path')
if (name === undefined) name = 'unknown'

times = (times === undefined) ? 1 : parseInt(times)
repeat = (repeat === undefined) ? 0 : parseInt(repeat)
prefixColor = (prefixColor === undefined) ? 'white' : prefixColor

Logger.setDefaults(false, true)

const logger = Logger(name, prefixColor)
const worker = require(path.resolve(process.cwd(), workerPath)).default

async function run() {
  logger.info(`Starting worker, will run ${times == 0 ? 'infinite' : times} jobs`)
  for (let job = 1; job !== times; job++) {
    try {
      logger.info(`Creating job #${job}`)
      await worker(name, job, logger)
      const minutes = job === times ? 0 : repeat / 60
      logger.success(`Job #${job} finished successfully${minutes > 0 ? `, will get back in ${minutes} minutes` : ''}`)
    } catch (error) {
      logger.error(`Job #${job} exited with error: ${error.message}`)
      console.error(error)
    }
    await sleep(repeat)
  }
  logger.success(`Worker finished`)
}

run()
  .then(() => process.exit(0))
  .catch(errorHandler)
