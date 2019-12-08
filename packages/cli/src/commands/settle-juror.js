const logger = require('@aragon/court-backend-shared/helpers/logger')('settle-juror')
const CourtProvider = require('../models/CourtProvider')

const command = 'settle-juror'
const describe = 'Settle juror for a dispute'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  juror: { alias: 'j', describe: 'Address of the juror to be settled', type: 'string', demand: true }
}

const handlerAsync = async ({ network, from, dispute, juror }) => {
  const court = await CourtProvider.for(network, from)
  await court.settleJuror(dispute, juror)
  logger.success(`Settled juror ${juror} for dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
