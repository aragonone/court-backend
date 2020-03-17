const logger = require('@aragonone/court-backend-shared/helpers/logger')('arbitrable')

const command = 'arbitrable'
const describe = 'Create new Arbitrable instance for the Court'

const builder = {
  owner: { alias: 'o', describe: 'Address owner of the Arbitrable', type: 'string' },
}

const handlerAsync = async (environment, { owner }) => {
  const court = await environment.getCourt()
  const arbitrable = await court.deployArbitrable(owner)
  logger.success(`Created Arbitrable instance ${arbitrable.address}`)
  console.log(arbitrable.address)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
