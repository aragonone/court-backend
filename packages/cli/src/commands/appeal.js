const logger = require('@aragon/court-backend-shared/helpers/logger')('appeal')
const CourtProvider = require('../models/CourtProvider')

const command = 'appeal'
const describe = 'Appeal dispute in favour of a certain outcome'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Outcome appealing in favor of', type: 'string', demand: true },
}

const handlerAsync = async ({ network, from, dispute, outcome }) => {
  const court = await CourtProvider.for(network, from)
  await court.appeal(dispute, outcome)
  logger.success(`Appealed dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
