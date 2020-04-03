const ethers = require('ethers')
const { bn } = require('../../helpers/numbers')

class JsonRpcSigner extends ethers.Signer {
  constructor(provider, address = undefined, { gasPrice = undefined, gasLimit = undefined } = {}) {
    super()

    this.address = address
    this.provider = provider
    this.gasPrice = gasPrice
    this.gasLimit = gasLimit

    Object.keys(ethers.providers.JsonRpcSigner.prototype)
      .filter(fn => !['constructor', 'sendTransaction'].includes(fn))
      .forEach(fn => { this[fn] = async (...args) => this._callSigner(fn, args) })
  }

  async sendTransaction(transaction) {
    if (!transaction.gasLimit && this.gasLimit) transaction.gasLimit = bn(this.gasLimit).toHexString()
    if (!transaction.gasPrice && this.gasPrice) transaction.gasPrice = bn(this.gasPrice).toHexString()

    const signer = await this._getSigner()
    const tx = await signer.sendTransaction(transaction)
    await tx.wait(1)
    return tx
  }

  async _callSigner(fn, args) {
    const signer = await this._getSigner()
    return signer[fn](...args)
  }

  async _getSigner() {
    if (!this.signer) this.signer = await this.provider.getSigner(this.address)
    return this.signer
  }
}

module.exports = JsonRpcSigner
