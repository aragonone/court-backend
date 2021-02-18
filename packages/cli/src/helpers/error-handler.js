const logger = require('@1hive/celeste-backend-shared/helpers/logger')('Error Handler')

module.exports = error => {
  logger.error(`Process finished with error:`)
  console.log(error)
  console.log()
  process.exit(1)
}
