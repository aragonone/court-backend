const logger = require('@aragon/court-backend-shared/helpers/logger')('mint')
const { bigExp } = require('@aragon/court-backend-shared/helpers/numbers')
const CourtProvider = require('../models/CourtProvider')

const command = 'mint'
const describe = 'Mint tokens for a certain address'

const builder = {
  token: { alias: 't', describe: 'Token symbol (ANJ or FEE)', type: 'string', demand: true },
  amount: { alias: 'a', describe: 'Amount to mint (without decimals)', type: 'string', demand: true },
  recipient: { alias: 'r', describe: 'Recipient address (will use default address if missing)', type: 'string' },
}

const handlerAsync = async ({ network, from, recipient, token: symbol, amount }) => {
  const court = await CourtProvider.for(network, from)
  const to = recipient || await court.environment.getSender()

  let token
  if (symbol.toLowerCase() === 'anj') token = await court.anj()
  if (symbol.toLowerCase() === 'fee') token = await court.feeToken()
  if (!token) throw new Error(`Minting ${symbol} is not supported yet`)

  logger.info(`Minting ${symbol} ${amount} to ${to}...`)
  const decimals = await token.decimals()
  await token.generateTokens(to, bigExp(amount, decimals))
  logger.success(`Minted ${symbol} ${amount} to ${to}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
