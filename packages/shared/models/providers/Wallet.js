const ethers = require('ethers')
const { bn } = require('../../helpers/numbers')
const GasPriceOracle = require('../../helpers/gas-price-oracle')

class Wallet extends ethers.Wallet {
  constructor(privateKey, provider, { gasPrice = undefined, gasLimit = undefined } = {}) {
    super(privateKey, provider)
    this.gasPrice = gasPrice
    this.gasLimit = gasLimit
  }

  async sendTransaction(transaction) {
    if (!transaction.gasLimit && this.gasLimit) transaction.gasLimit = bn(this.gasLimit).toHexString()
    if (!transaction.gasPrice && this.gasPrice) transaction.gasPrice = bn(await this.getGasPrice()).toHexString()
    const tx = await super.sendTransaction(transaction)
    await this.provider.waitForTransaction(tx.hash)
    return tx
  }

  async getGasPrice() {
    const network = await this.provider.getNetwork()
    const averageGasPrice = await GasPriceOracle.fetch(network.chainId)
    return averageGasPrice || this.gasPrice
  }
}

module.exports = Wallet
