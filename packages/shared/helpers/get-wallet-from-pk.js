const { isValidPrivate } = require('ethereumjs-util')
const { fromPrivateKey } = require('ethereumjs-wallet')

module.exports = function (key) {
  const privateKey = Buffer.from(key.replace('0x', ''), 'hex')
  if (!isValidPrivate(privateKey)) throw Error('Given private key is not valid')
  return fromPrivateKey(privateKey)
}
