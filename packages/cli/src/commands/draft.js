const logger = require('@aragonone/court-backend-shared/helpers/logger')('draft')

const command = 'draft'
const describe = 'Draft dispute and close evidence submission period if necessary'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
}

const handlerAsync = async (environment, { dispute }) => {
  const court = await environment.getCourt()
  const jurors = await court.draft(dispute)
  logger.success(`Drafted dispute #${dispute} with jurors ${jurors.join(', ')}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
