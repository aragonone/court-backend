#! /usr/bin/env node

import { fork } from 'child_process'
import { workers } from '../config'
import Logger from '@aragon/court-backend-shared/helpers/logger'

require('dotenv').config()

Logger.setDefaults(false, true)
const logger = Logger('services')

for (const { name, path, processes, times, tries, repeat } of workers) {
  for (let process = 1; process <= processes; process++) {
    logger.info(`Creating worker ${name} #${process}`)
    const child = fork('./bin/worker', [path, name, times, tries, repeat])
    logger.success(`Created worker ${name} #${process} with pid #${child.pid}`)
  }
}
