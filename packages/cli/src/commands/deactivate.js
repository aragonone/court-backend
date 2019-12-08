const logger = require('@aragon/court-backend-shared/helpers/logger')('deactivate')
const CourtProvider = require('../models/CourtProvider')

const command = 'deactivate'
const describe = 'Deactivate ANJ to the Court'

const builder = {
  amount: { alias: 'a', describe: 'Number of ANJ tokens to deactivate', type: 'string', demand: true },
}

const handlerAsync = async ({ network, from, amount }) => {
  const court = await CourtProvider.for(network, from)
  await court.deactivate(amount)
  logger.success(`Requested ANJ ${amount} for deactivation`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
