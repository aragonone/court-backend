const logger = require('@aragon/court-backend-shared/helpers/logger')('settle-round')
const CourtProvider = require('../models/CourtProvider')

const command = 'settle-round'
const describe = 'Settle penalties and appeals for a dispute'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
}

const handlerAsync = async ({ network, from, dispute }) => {
  const court = await CourtProvider.for(network, from)
  await court.settleRound(dispute)
  logger.success(`Settled rounds of dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
