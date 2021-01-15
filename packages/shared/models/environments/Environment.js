const Court = require('../Court')
const { request } = require('graphql-request')

const SUBGRAPH_LOCAL = 'http://127.0.0.1:8000'
const SUBGRAPH_REMOTE = 'https://api.thegraph.com'

class Environment {
  constructor(network) {
    this.network = network
  }

  getSubgraph() {
    const base = this.network === 'rpc' ? SUBGRAPH_LOCAL : SUBGRAPH_REMOTE
    const env = this.network === 'mainnet' ? '' : `-${this.network}`
    return `${base}/subgraphs/name/1hive/celeste${env}`
  }

  async query(query) {
    const subgraph = this.getSubgraph()
    return request(subgraph, query)
  }

  async getCourt(address) {
    const AragonCourt = await this.getArtifact('AragonCourt', '@aragon/court')
    const court = await AragonCourt.at(address)
    return new Court(court, this)
  }

  async getTransaction(hash) {
    const provider = await this.getProvider()
    return provider.waitForTransaction(hash)
  }

  async getProvider() {
    if (!this.provider) this.provider = await this._getProvider()
    return this.provider
  }

  async getSigner() {
    if (!this.signer) this.signer = await this._getSigner()
    return this.signer
  }

  async getArtifacts() {
    if (!this.artifacts) this.artifacts = await this._getArtifacts()
    return this.artifacts
  }

  async getArtifact(contractName, dependency = undefined) {
    const artifacts = await this.getArtifacts()
    return artifacts.require(contractName, dependency)
  }

  async getAccounts() {
    const provider = await this.getProvider()
    return provider.listAccounts()
  }

  async getSender() {
    const signer = await this.getSigner()
    return signer.getAddress()
  }

  async _getProvider() {
    throw Error('subclass responsibility')
  }

  async _getSigner() {
    throw Error('subclass responsibility')
  }

  async _getArtifacts() {
    throw Error('subclass responsibility')
  }
}

module.exports = Environment
