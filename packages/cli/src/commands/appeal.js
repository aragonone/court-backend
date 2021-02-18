const logger = require('@1hive/celeste-backend-shared/helpers/logger')('appeal')

const command = 'appeal'
const describe = 'Appeal dispute in favour of a certain outcome'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Outcome appealing in favor of', type: 'string', demand: true },
}

const handlerAsync = async (environment, { dispute, outcome }) => {
  const court = await environment.getCourt()
  await court.appeal(dispute, outcome)
  logger.success(`Appealed dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
