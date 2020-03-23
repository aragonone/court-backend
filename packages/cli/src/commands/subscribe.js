const logger = require('@aragonone/court-backend-shared/helpers/logger')('subscribe')

const command = 'subscribe'
const describe = 'Subscribe Arbitrable instance to the Court'

const builder = {
  periods: { alias: 'p', describe: 'Number of periods to be paid', type: 'string', default: '1', demand: true },
  address: { alias: 'a', describe: 'Address of the Arbitrable instance to pay subscriptions for', type: 'string', demand: true }
}

const handlerAsync = async (environment, { periods, address }) => {
  const court = await environment.getCourt()
  await court.subscribe(address, periods)
  logger.success(`Subscribed Arbitrable instance ${address} for ${periods} periods`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
