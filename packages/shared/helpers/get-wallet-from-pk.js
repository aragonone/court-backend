const { isValidPrivate } = require('ethereumjs-util')
const Wallet = require('ethereumjs-wallet')

module.exports = function (key) {
  const privateKey = Buffer.from(key.replace('0x', ''), 'hex')
  if (!isValidPrivate(privateKey)) throw Error('Given private key is not valid')
  return Wallet.default.fromPrivateKey(privateKey)
}
