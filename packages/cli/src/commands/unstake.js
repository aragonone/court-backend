const logger = require('@aragon/court-backend-shared/helpers/logger')('unstake')
const CourtProvider = require('../models/CourtProvider')

const command = 'unstake'
const describe = 'Unstake ANJ tokens for a juror'

const builder = {
  amount: { alias: 'a', describe: 'Number of ANJ tokens to unstake', type: 'string', demand: true },
  data: { alias: 'd', describe: 'Optional data that can be used to ask for token activation', type: 'string' },
}

const handlerAsync = async ({ network, from, amount, data }) => {
  const court = await CourtProvider.for(network, from)
  await court.unstake(amount, data)
  logger.success(`Unstaked ${amount} ANJ`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
