const logger = require('@aragon/court-backend-shared/helpers/logger')('confirm-appeal')
const CourtProvider = require('../models/CourtProvider')

const command = 'confirm-appeal'
const describe = 'Confirm an existing appeal for a dispute'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Outcome confirming the appeal in favor of', type: 'string', demand: true },
}

const handlerAsync = async ({ network, from, dispute, outcome }) => {
  const court = await CourtProvider.for(network, from)
  await court.confirmAppeal(dispute, outcome)
  logger.success(`Confirmed appeal for dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
