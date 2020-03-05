const logger = require('@aragon/court-backend-shared/helpers/logger')('donate')

const command = 'donate'
const describe = 'Donate funds to court jurors'

const builder = {
  amount: { alias: 'a', describe: 'Fee amount to be donated', type: 'string', demand: true },
}

const handlerAsync = async (environment, { amount }) => {
  const court = await environment.getCourt()
  await court.donate(amount)
  logger.success(`Donated ${amount} fees for court jurors`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
