const logger = require('@aragonone/court-backend-shared/helpers/logger')('reveal')

const command = 'reveal'
const describe = 'Reveal committed vote'

const builder = {
  juror: { alias: 'j', describe: 'Address of the juror revealing for', type: 'string' },
  dispute: { alias: 'd', describe: 'Dispute identification number', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Committed outcome to reveal', type: 'string', demand: true },
  password: { alias: 'p', describe: 'Password used to commit the vote', type: 'string', demand: true },
}

const handlerAsync = async (environment, { from, juror, dispute, outcome, password }) => {
  const court = await environment.getCourt()
  const onBehalfOf = juror || await court.environment.getSender()
  await court.reveal(dispute, onBehalfOf, outcome, password)
  logger.success(`Vote revealed for dispute #${dispute} for juror ${onBehalfOf}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
