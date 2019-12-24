const logger = require('@aragon/court-backend-shared/helpers/logger')('dispute')

const command = 'dispute'
const describe = 'Create dispute submitting evidence'

const builder = {
  subject: { alias: 's', describe: 'Address of the arbitrable instance creating the dispute', type: 'string', demand: true },
  rulings: { alias: 'r', describe: 'Number of rulings', type: 'string', default: '2', demand: true },
  metadata: { alias: 'm', describe: 'Dispute metadata, it will only be logged', type: 'string' },
  evidence: { alias: 'e', describe: 'Evidence links (ipfs, http, etc)', type: 'array' },
}

const handlerAsync = async (environment, { subject, rulings, metadata, evidence }) => {
  const court = await environment.getCourt()
  const disputeId = await court.createDispute(subject, rulings, metadata, evidence)
  logger.success(`Created dispute #${disputeId}`)
  logger.warn('Evidence submission period cannot be closed immediately, please do it manually after this term')
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
