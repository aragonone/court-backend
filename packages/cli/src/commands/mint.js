const logger = require('../helpers/logger')('Minter')
const { bigExp } = require('@aragon/court-backend-shared/helpers/numbers')
const CourtProvider = require('../models/CourtProvider')

const command = 'mint'
const describe = 'Mint tokens for a certain address'

const builder = {
  to: { alias: 'r', describe: 'Recipient address', type: 'string', demand: true },
  token: { alias: 't', describe: 'Token symbol', type: 'string', demand: true },
  amount: { alias: 'a', describe: 'Amount to mint', type: 'string', demand: true },
}

const handlerAsync = async ({ network, from, to, token: symbol, amount }) => {
  const court = await CourtProvider.for(network, from)

  if (symbol.toLowerCase() === 'anj') {
    logger.info(`Minting ${symbol} ${amount} to ${to} ...`)
    const token = await court.anj()
    const decimals = await token.decimals()
    await token.generateTokens(to, bigExp(amount, decimals))
    logger.success(`Minted ${symbol} ${amount} to ${to}`)
  } else {
    throw new Error(`Minting ${symbol} is not supported yet`)
  }
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
