const logger = require('@aragonone/court-backend-shared/helpers/logger')('commit')

const command = 'commit'
const describe = 'Commit vote for a dispute round'

const builder = {
  dispute: { alias: 'd', describe: 'Dispute committing a vote for', type: 'string', demand: true },
  outcome: { alias: 'o', describe: 'Voting outcome', type: 'string', demand: true },
  password: { alias: 'p', describe: 'Password to hash the vote to commit', type: 'string', demand: true },
}

const handlerAsync = async (environment, { dispute, outcome, password }) => {
  const court = await environment.getCourt()
  await court.commit(dispute, outcome, password)
  logger.success(`Committed vote for dispute #${dispute}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
