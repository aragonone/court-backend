const Logger = require('@aragonone/court-backend-shared/helpers/logger')

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
    console.error({
      context: `Worker '${this.worker}' job #${this.job}`,
      message: error.message,
      stack: error.stack
    })
  }
}

module.exports = (worker, color) => {
  const logger = Logger(worker, color)
  return new WorkerLogger(worker, logger)
}

module.exports.setDefaults = Logger.setDefaults
