const Logger = require('@1hive/celeste-backend-shared/helpers/logger')

class WorkerLogger {
  constructor(worker, logger) {
    this.job = undefined
    this.worker = worker
    this.logger = logger
  }

  info(msg) {
    this.logger.info(msg)
  }

  success(msg) {
    this.logger.success(msg)
  }

  warn(msg) {
    this.logger.warn(msg)
  }

  error(msg, error) {
    this.logger.error(msg)
    console.error(`Context: Worker '${this.worker}' job #${this.job}`)
    console.error(`Message: ${error.message}`)
    console.error(`Stack: ${error.stack}`)
  }
}

module.exports = (worker, color) => {
  const logger = Logger(worker, color)
  return new WorkerLogger(worker, logger)
}

module.exports.setDefaults = Logger.setDefaults
