const Web3 = require('web3')
const Court = require('../Court')
const { request } = require('graphql-request')

const SUBGRAPH_LOCAL = 'http://127.0.0.1:8000'
const SUBGRAPH_REMOTE = 'https://api.thegraph.com'

class Environment {
  constructor(network, sender = undefined) {
    this.network = network
    this.sender = sender
  }

  getSubgraph() {
    const base = this.network === 'rpc' ? SUBGRAPH_LOCAL : SUBGRAPH_REMOTE
    const env = this.network === 'mainnet' ? '' : `-${this.network}`
    return `${base}/subgraphs/name/aragon/aragon-court${env}`
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

  async getLastBlockNumber() {
    const { number } = await this.getLastBlock()
    return number
  }

  async getLastBlock() {
    return this.getBlock('latest')
  }

  async getBlock(number) {
    const web3 = await this.getWeb3()
    return web3.eth.getBlock(number)
  }

  async getTransaction(hash) {
    const web3 = await this.getWeb3()
    return web3.eth.getTransaction(hash)
  }

  async getWeb3() {
    if (!this.web3) this.web3 = new Web3(await this.getProvider())
    return this.web3
  }

  async getProvider() {
    if (!this.provider) this.provider = await this._getProvider()
    return this.provider
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
    const web3 = await this.getWeb3()
    return web3.eth.getAccounts()
  }

  async getSender() {
    if (!this.sender) this.sender = await this._getSender()
    return this.sender
  }

  async _getProvider() {
    throw Error('subclass responsibility')
  }

  async _getArtifacts() {
    throw Error('subclass responsibility')
  }

  async _getSender() {
    throw Error('subclass responsibility')
  }
}

module.exports = Environment
