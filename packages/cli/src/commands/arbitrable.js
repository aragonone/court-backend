const logger = require('@aragon/court-backend-shared/helpers/logger')('arbitrable')
const CourtProvider = require('../models/CourtProvider')

const command = 'arbitrable'
const describe = 'Create new Arbitrable instance for the Court'

const builder = {}

const handlerAsync = async ({ network, from }) => {
  const court = await CourtProvider.for(network, from)
  const arbitrable = await court.deployArbitrable()
  logger.success(`Created Arbitrable instance ${arbitrable.address}`)
  console.log(arbitrable.address)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
