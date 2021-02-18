const logger = require('@aragonone/celeste-backend-shared/helpers/logger')('stake')

const command = 'stake'
const describe = 'Stake ANJ tokens for a juror'

const builder = {
  juror: { alias: 'j', describe: 'Address of the juror staking the tokens', type: 'string', demand: true },
  amount: { alias: 'a', describe: 'Number of ANJ tokens to stake', type: 'string', demand: true },
  data: { alias: 'd', describe: 'Optional data that can be used to ask for token activation', type: 'string' },
}

const handlerAsync = async (environment, { juror, amount, data }) => {
  const court = await environment.getCourt()
  await court.stake(juror, amount, data)
  logger.success(`Staked ${amount} ANJ for ${juror}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
