const logger = require('@1hive/celeste-backend-shared/helpers/logger')('settle-juror')

const command = 'settle-juror'
const describe = 'Settle juror for a dispute'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  juror: { alias: 'j', describe: 'Address of the juror to be settled', type: 'string', demand: true }
}

const handlerAsync = async (environment, { dispute, juror }) => {
  const court = await environment.getCourt()
  await court.settleJuror(dispute, juror)
  logger.success(`Settled juror ${juror} for dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
