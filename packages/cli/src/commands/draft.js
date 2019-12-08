const logger = require('@aragon/court-backend-shared/helpers/logger')('draft')
const CourtProvider = require('../models/CourtProvider')

const command = 'draft'
const describe = 'Draft dispute and close evidence submission period if necessary'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
}

const handlerAsync = async ({ network, from, dispute }) => {
  const court = await CourtProvider.for(network, from)
  const jurors = await court.draft(dispute)
  logger.success(`Drafted dispute #${dispute} with jurors ${jurors.join(', ')}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
