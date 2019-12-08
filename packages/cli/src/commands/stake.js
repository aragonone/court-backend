const logger = require('@aragon/court-backend-shared/helpers/logger')('stake')
const CourtProvider = require('../models/CourtProvider')

const command = 'stake'
const describe = 'Stake ANJ tokens for a juror'

const builder = {
  juror: { alias: 'j', describe: 'Address of the juror staking the tokens', type: 'string', demand: true },
  amount: { alias: 'a', describe: 'Number of ANJ tokens to stake', type: 'string', demand: true },
  data: { alias: 'd', describe: 'Optional data that can be used to ask for token activation', type: 'string' },
}

const handlerAsync = async ({ network, from, juror, amount, data }) => {
  const court = await CourtProvider.for(network, from)
  await court.stake(juror, amount, data)
  logger.success(`Staked ${amount} ANJ for ${juror}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
