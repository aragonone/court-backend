import Web3 from 'web3'
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

  async getCourt(address) {
    if (!this.court) this.court = await CourtProvider.for(this.getProvider(), address)
    return this.court
  },

  async getAccount() {
    return window.ethereum.selectedAddress
  },

  async getBalance(address) {
    return new Promise((resolve, reject) =>
      Network.getWeb3().eth.getBalance(address, (error, value) =>
        error ? reject(error) : resolve(value)))
  },

  getWeb3() {
    if (!this.web3) this.web3 = new Web3(this.getProvider())
    return this.web3
  },

  getProvider() {
    if (!this.provider) {
      if (this.isEnabled()) this.provider = window.web3.currentProvider
      else throw Error('Could not access to a browser web3 provider, please make sure to allow one.')
      this.provider.setMaxListeners(300)
    }
    return this.provider
  },

  isEnabled() {
    return !!(window.ethereum && window.ethereum.selectedAddress && window.web3 && window.web3.currentProvider)
  },
}

export default Network
