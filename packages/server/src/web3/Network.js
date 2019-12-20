import Web3 from 'web3'
import Environment from './Environment'
import Court from '@aragon/court-backend-shared/models/Court'

const COURT = process.env.COURT
const SENDER = process.env.SENDER
const WEB3_HTTP_PROVIDER = process.env.WEB3_HTTP_PROVIDER

export default {
  async getCourt() {
    if (!this.court) {
      if (!COURT) throw Error('Missing court address, please make sure one is provided through the COURT env variable')
      const environment = await this.getEnvironment()
      const AragonCourt = await environment.getArtifact('AragonCourt', '@aragon/court')
      const court = await AragonCourt.at(COURT)
      this.court = new Court(court, environment)
    }
    return this.court
  },

  async getSender() {
    if (!this.sender) {
      if (!SENDER) throw Error('Missing sender address, please make sure one is provided through the SENDER env variable')
      this.sender = SENDER
    }
    return this.sender
  },

  async estimateGas({ from, to, data }) {
    const call = { from, to, data }
    const web3 = await this.getWeb3()
    return web3.eth.estimateGas(call)
  },

  async getEnvironment() {
    if (!this.environment) {
      const sender = await this.getSender()
      const provider = await this.getProvider()
      this.environment = new Environment(provider, sender)
    }
    return this.environment
  },

  async getWeb3() {
    if (!this.web3) {
      const provider = await this.getProvider()
      this.web3 = new Web3(provider)
    }
    return this.web3
  },

  async getProvider() {
    if (!this.provider) {
      if (!WEB3_HTTP_PROVIDER) throw Error('Missing web3 HTTP provider, please make sure one is provided through the WEB3_HTTP_PROVIDER env variable')
      this.provider = new Web3.providers.HttpProvider(WEB3_HTTP_PROVIDER)
    }
    return this.provider
  },
}
