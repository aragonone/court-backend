const logger = require('@aragonone/court-backend-shared/helpers/logger')('arbitrable')

const command = 'arbitrable'
const describe = 'Create new Arbitrable instance for the Court'

const builder = {
  precedence: { alias: 'p', describe: 'Use Arbitrable version for precedence campaign', type: 'boolean', demand: false, default: false },
}

const handlerAsync = async (environment, { precedence }) => {
  const court = await environment.getCourt()
  const arbitrable = await court.deployArbitrable(precedence)
  logger.success(`Created Arbitrable instance ${arbitrable.address}`)
  console.log(arbitrable.address)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
