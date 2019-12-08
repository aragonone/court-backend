const logger = require('@aragon/court-backend-shared/helpers/logger')('activate')
const CourtProvider = require('../models/CourtProvider')

const command = 'activate'
const describe = 'Activate ANJ to the Court'

const builder = {
  amount: { alias: 'a', describe: 'Number of ANJ tokens to activate', type: 'string', demand: true },
}

const handlerAsync = async ({ network, from, amount }) => {
  const court = await CourtProvider.for(network, from)
  await court.activate(amount)
  logger.success(`Activated ANJ ${amount}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
