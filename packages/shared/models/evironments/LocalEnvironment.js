const Environment = require('./Environment')
const DynamicArtifacts = require('../artifacts/DynamicArtifacts')
const HDWalletProvider = require("@truffle/hdwallet-provider");

require('dotenv').config() // Load env vars from .env file

/*
Requires the following env variables to be defined:
  - NETWORK: Network to connect to: rpc, rinkeby, mainnet, ...
  - PRIVATE_KEY: Private key of the account used
  - RPC: RPC endpoint, like "https://host:port/..."
  - COURT_ADDRESS: Address of the target Court contract to interact with
  - GAS_PRICE: Gas price (for TruffleContract object)
  - GAS: Gas limit (for TruffleContract object)
*/
class LocalEnvironment extends Environment {
  constructor(network) {
    super(process.env.NETWORK)
  }

  async getCourt(address = undefined) {
    return super.getCourt(process.env.COURT_ADDRESS)
  }

  async _getProvider() {
    const keys = [ process.env.PRIVATE_KEY ]
    const rpc =  process.env.RPC
    return new HDWalletProvider(keys, rpc);
  }

  async _getArtifacts() {
    const from = await this.getSender()
    const provider = await this.getProvider()
    return new DynamicArtifacts(provider, { from, gasPrice: process.env.GAS_PRICE, gas: process.env.GAS })
  }

  async _getSender() {
    const provider = await this.getProvider()
    return provider.addresses[0]
  }
}

module.exports = LocalEnvironment
