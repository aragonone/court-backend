const logger = require('@aragon/court-backend-shared/helpers/logger')('arbitrable')

const command = 'arbitrable'
const describe = 'Create new Arbitrable instance for the Court'

const builder = {}

const handlerAsync = async (environment) => {
  const court = await environment.getCourt()
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
