const logger = require('@aragon/court-backend-shared/helpers/logger')('heartbeat')
const CourtProvider = require('../models/CourtProvider')

const command = 'heartbeat'
const describe = 'Call court hearbeat'

const builder = {
  transitions: { alias: 't', describe: 'Max number of transitions', type: 'string' }
}

const handlerAsync = async ({ network, from, transitions }) => {
  const court = await CourtProvider.for(network, from)
  const heartbeats = await court.heartbeat(transitions)
  logger.success(`Transitioned ${heartbeats} Court terms`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
