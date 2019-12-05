const { BN, fromWei } = require('web3-utils')

const bn = x => new BN(x)
const bigExp = (x, y = 18) => bn(x).mul(bn(10).pow(bn(y)))
const maxUint = (e) => bn(2).pow(bn(e)).sub(bn(1))
const tokenToString = (x, { decimals, symbol }) => `${fromWei(bn(x).toString())} ${symbol}`

const MAX_UINT64 = maxUint(64)

module.exports = {
  bn,
  bigExp,
  maxUint,
  tokenToString,
  MAX_UINT64
}
