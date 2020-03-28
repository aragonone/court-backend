const ethers = require('ethers')
const { bn } = require('../../helpers/numbers')

class Wallet extends ethers.Wallet {
  constructor(privateKey, provider, { gasPrice = undefined, gasLimit = undefined } = {}) {
    super(privateKey, provider)
    this.gasPrice = gasPrice
    this.gasLimit = gasLimit
  }

  async sendTransaction(transaction) {
    if (!transaction.gasLimit && this.gasLimit) transaction.gasLimit = bn(this.gasLimit).toHexString()
    if (!transaction.gasPrice && this.gasPrice) transaction.gasPrice = bn(this.gasPrice).toHexString()
    const tx = await super.sendTransaction(transaction)
    await this.provider.waitForTransaction(tx.hash)
    return tx
  }
}

module.exports = Wallet
