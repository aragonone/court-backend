const logger = require('@aragonone/celeste-backend-shared/helpers/logger')('deactivate')

const command = 'deactivate'
const describe = 'Deactivate ANJ to the Court'

const builder = {
  amount: { alias: 'a', describe: 'Number of ANJ tokens to deactivate', type: 'string', demand: true },
}

const handlerAsync = async (environment, { amount }) => {
  const court = await environment.getCourt()
  await court.deactivate(amount)
  logger.success(`Requested ANJ ${amount} for deactivation`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
