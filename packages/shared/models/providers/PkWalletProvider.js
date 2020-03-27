const URL = require('url')
const Web3 = require('web3')
const ethereumTx = require('ethereumjs-tx')
const ethereumUtil = require('ethereumjs-util')
const ProviderEngine = require('web3-provider-engine')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters')
const ProviderSubprovider = require('web3-provider-engine/subproviders/provider')
const NonceTrackerSubprovider = require('web3-provider-engine/subproviders/nonce-tracker')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet')

const getWalletFromPrivateKey = require('../../helpers/get-wallet-from-pk')

const WS_PROTOCOLS = ['ws:', 'wss:']
const VALID_PROTOCOLS = ['http:', 'https:', ...WS_PROTOCOLS]
const NONCE_SUBPROVIDER = new NonceTrackerSubprovider()

class HDWalletProvider {
  constructor(privateKey, rpc, engineOpts = {}) {
    this.rpc = rpc
    this.wallet = getWalletFromPrivateKey(privateKey)
    this.account = this.wallet.getAddressString()

    this.engine = new ProviderEngine(engineOpts)
    this.engine.addProvider(this._buildHookedWalletSubprovider())
    this.engine.addProvider(NONCE_SUBPROVIDER)
    this.engine.addProvider(new FilterSubprovider())
    this.engine.addProvider(this._buildProviderSubprovider())
    this.engine.start()
  }

  send(payload, callback) {
    return this.engine.send.call(this.engine, payload, callback)
  }

  sendAsync(payload, callback) {
    this.engine.sendAsync.call(this.engine, payload, callback)
  }

  getAddress() {
    return this.account
  }

  getAddresses() {
    return [this.getAddress()]
  }

  _buildProviderSubprovider() {
    if (typeof this.rpc !== 'string') throw Error('Please provide a string for the RPC provider')
    const url = URL.parse(this.rpc.toLowerCase())
    const isValidProtocol = VALID_PROTOCOLS.includes(url.protocol) && url.slashes
    if (!isValidProtocol) throw Error('Please provide a valid RPC using the http, https, ws, or wss protocol')

    const subProvider = WS_PROTOCOLS.includes(url.protocol)
      ? new Web3.providers.WebsocketProvider(this.rpc)
      : new Web3.providers.HttpProvider(this.rpc, { keepAlive: false })

    return new ProviderSubprovider(subProvider)
  }

  _buildHookedWalletSubprovider() {
    const { account, wallet } = this

    return new HookedWalletSubprovider({
      getAccounts(cb) {
        cb(null, [account])
      },

      getPrivateKey(address, cb) {
        if (account !== address) return cb('Account not found')
        cb(null, wallet.getPrivateKey().toString('hex'))
      },

      signTransaction(txParams, cb) {
        const from = txParams.from.toLowerCase()
        if (account !== from) return cb('Account not found')

        const tx = new ethereumTx(txParams)
        tx.sign(wallet.getPrivateKey())
        const rawTx = `0x${tx.serialize().toString('hex')}`
        cb(null, rawTx)
      },

      signMessage({ data, from }, cb) {
        if (!data) return cb('No data to sign')
        if (account !== from) return cb('Account not found')

        const dataBuff = ethereumUtil.toBuffer(data)
        const msgHashBuff = ethereumUtil.hashPersonalMessage(dataBuff)
        const { v, r, s } = ethereumUtil.ecsign(msgHashBuff, wallet.getPrivateKey())
        const rpcSig = ethereumUtil.toRpcSig(v, r, s)
        cb(null, rpcSig)
      },

      signPersonalMessage(...args) {
        this.signMessage(...args)
      }
    })
  }
}
module.exports = HDWalletProvider
