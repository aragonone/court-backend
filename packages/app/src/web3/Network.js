import Web3 from 'web3'
import sleep from '../helpers/sleep'
import CourtProvider from './CourtProvider'

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT

const Network = {
  async query(query) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query })
    })
    const json = await response.json()
    return json.data
  },

  async getAccount() {
    return window.web3.currentProvider.selectedAddress
  },

  async getCourt(address) {
    if (!this.court) {
      const provider = await this.getProvider()
      this.court = await CourtProvider.for(provider, address)
    }
    return this.court
  },

  async isCourtAt(address) {
    try {
      await this.getCourt(address)
      return true
    } catch (error) {
      if (error.message.includes(`no code at address ${address}`)) return false
      else throw error
    }
  },

  async getBalance(address) {
    const web3 = await this.getWeb3()
    return new Promise((resolve, reject) =>
      web3.eth.getBalance(address, (error, value) =>
        error ? reject(error) : resolve(value)))
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
      if (this.isEnabled()) this.provider = window.web3.currentProvider
      else throw Error('Could not access to a browser web3 provider, please make sure to allow one.')
      this.provider.setMaxListeners(300)
    }
    return this.provider
  },

  async isEnabled() {
    await sleep(2)
    const { web3 } = window
    return !!(web3 && web3.currentProvider && web3.currentProvider.selectedAddress)
  },
}

export default Network
