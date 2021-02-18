const logger = require('@aragonone/celeste-backend-shared/helpers/logger')('dispute')

const command = 'dispute'
const describe = 'Create dispute submitting evidence'

const builder = {
  arbitrable: { alias: 'a', describe: 'Address of the arbitrable instance creating the dispute', type: 'string', demand: true },
  rulings: { alias: 'r', describe: 'Number of rulings', type: 'string', default: '2', demand: true },
  metadata: { alias: 'm', describe: 'Dispute metadata, it will only be logged', type: 'string' },
  evidence: { alias: 'e', describe: 'Evidence contents', type: 'array' },
  submitters: { alias: 's', describe: 'Submitters for each evidence content', type: 'array' },
  close: { alias: 'c', describe: 'Whether the evidence period should be closed or not', type: 'boolean', default: false },
}

const handlerAsync = async (environment, { arbitrable, rulings, metadata, evidence, submitters, close }) => {
  const court = await environment.getCourt()
  const disputeId = await court.createDispute(arbitrable, rulings, metadata, evidence, submitters, close)
  logger.success(`Created dispute #${disputeId}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
