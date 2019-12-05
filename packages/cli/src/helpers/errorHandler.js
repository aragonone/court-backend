const logger = require('./logger')('Error Handler')

module.exports = error => {
  logger.error(`Process finished with error:`)
  console.log(error)
  console.log()
  process.exit(1)
}
