const logger = require('@aragon/court-backend-shared/helpers/logger')('reveal')
const CourtProvider = require('../models/CourtProvider')

const command = 'reveal'
const describe = 'Reveal committed vote'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Committed outcome to reveal', type: 'string', demand: true },
  password: { alias: 'p', describe: 'Password used to commit the vote', type: 'string', demand: true },
}

const handlerAsync = async ({ network, from, dispute, outcome, password }) => {
  const court = await CourtProvider.for(network, from)
  await court.reveal(dispute, outcome, password)
  logger.success(`Vote revealed for dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
