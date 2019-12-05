const logger = require('@aragon/court-backend-shared/helpers/logger')('subscribe')
const CourtProvider = require('../models/CourtProvider')

const command = 'subscribe'
const describe = 'Subscribe new or existing Arbitrable instance to the Court'

const builder = {
  periods: { alias: 'p', describe: 'Number of periods to be paid', type: 'string', default: '1', demand: true },
  address: { alias: 'a', describe: 'Address of the arbitrable instance to pay subscriptions for', type: 'string' }
}

const handlerAsync = async ({ network, from, periods, address }) => {
  const court = await CourtProvider.for(network, from)
  const arbitrable = await court.subscribe(periods, address)
  logger.success(`Created arbitrable instance ${arbitrable.address}`)
  logger.success(`Subscribed arbitrable instance ${arbitrable.address} for ${periods} periods`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
