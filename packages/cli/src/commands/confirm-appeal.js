const logger = require('@1hive/celeste-backend-shared/helpers/logger')('confirm-appeal')

const command = 'confirm-appeal'
const describe = 'Confirm an existing appeal for a dispute'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Outcome confirming the appeal in favor of', type: 'string', demand: true },
}

const handlerAsync = async (environment, { dispute, outcome }) => {
  const court = await environment.getCourt()
  await court.confirmAppeal(dispute, outcome)
  logger.success(`Confirmed appeal for dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
