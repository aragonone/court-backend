const Wallet = require('../providers/Wallet')
const Environment = require('./Environment')
const JsonRpcProvider = require('../providers/JsonRpcProvider')
const DynamicArtifacts = require('../artifacts/DynamicArtifacts')

require('dotenv').config() // Load env vars from .env file

/**
 * Requires the following env variables to be defined:
 *   - NETWORK: Network to connect to: rpc, rinkeby, mainnet, ...
 *   - PRIVATE_KEY: Private key of the account used
 *   - RPC: RPC endpoint, like "https://host:port/..."
 *   - COURT_ADDRESS: Address of the target Court contract to interact with
 *   - GAS_PRICE: Default gas price value
 *   - GAS: Default gas limit value
 *   - WEB3_POLLING_INTERVAL: Milliseconds interval for blocks polling
 */

const { NETWORK, COURT_ADDRESS, RPC, PRIVATE_KEY, GAS, GAS_PRICE, WEB3_POLLING_INTERVAL } = process.env

class LocalEnvironment extends Environment {
  constructor() {
    super(NETWORK)
  }

  async getCourt(address = undefined) {
    return super.getCourt(COURT_ADDRESS)
  }

  async _getProvider() {
    const provider = new JsonRpcProvider(RPC, this.getChainName())
    provider.pollingInterval = parseInt(WEB3_POLLING_INTERVAL)
    return provider
  }

  async _getSigner() {
    const provider = await this.getProvider()
    return new Wallet(PRIVATE_KEY, provider, { gasPrice: GAS_PRICE, gasLimit: GAS })
  }

  async _getArtifacts() {
    const signer = await this._getSigner()
    return new DynamicArtifacts(signer)
  }
}

module.exports = LocalEnvironment
