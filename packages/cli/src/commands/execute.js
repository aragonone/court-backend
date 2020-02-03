const logger = require('@aragon/court-backend-shared/helpers/logger')('execute')

const command = 'execute'
const describe = 'Execute ruling for a dispute'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
}

const handlerAsync = async (environment, { dispute }) => {
  const court = await environment.getCourt()
  await court.execute(dispute)
  logger.success(`Executed final ruling of dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
