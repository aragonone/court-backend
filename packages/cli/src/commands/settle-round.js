const logger = require('@aragonone/court-backend-shared/helpers/logger')('settle-round')

const command = 'settle-round'
const describe = 'Settle penalties and appeals for a dispute'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
}

const handlerAsync = async (environment, { dispute }) => {
  const court = await environment.getCourt()
  await court.settleRound(dispute)
  logger.success(`Settled rounds of dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
