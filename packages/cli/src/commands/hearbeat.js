const logger = require('@aragon/court-backend-shared/helpers/logger')('heartbeat')

const command = 'heartbeat'
const describe = 'Call court hearbeat'

const builder = {
  transitions: { alias: 't', describe: 'Max number of transitions', type: 'string' }
}

const handlerAsync = async (environment, { transitions }) => {
  const court = await environment.getCourt()
  const heartbeats = await court.heartbeat(transitions)
  logger.success(`Transitioned ${heartbeats} Court terms`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
