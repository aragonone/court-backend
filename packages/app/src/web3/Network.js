import Web3 from 'web3'
import CourtProvider from './CourtProvider'

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT
const WEB3_HTTP_PROVIDER = process.env.REACT_APP_WEB3_HTTP_PROVIDER

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
    const accounts = await this.getAccounts()
    if (accounts.length === 0) throw Error('No accounts were provided in your web3 provider, please add one to read account related information.')
    return accounts[0]
  },

  async getAccounts() {
    return new Promise(function (resolve, reject) {
      Network.getWeb3().eth.getAccounts(Network._web3Callback(resolve, reject))
    })
  },

  async getBalance(address) {
    return new Promise(function (resolve, reject) {
      Network.getWeb3().eth.getBalance(address, Network._web3Callback(resolve, reject))
    })
  },

  getWeb3() {
    if (!this.web3) this.web3 = new Web3(this.getProvider())
    return this.web3
  },

  getProvider() {
    if (!this.provider) {
      this.provider = window.web3
        ? window.web3.currentProvider
        : new Web3.providers.HttpProvider(WEB3_HTTP_PROVIDER)
      this.provider.setMaxListeners(300)
    }
    return this.provider
  },

  _web3Callback(resolve, reject) {
    return function (error, value) {
      if (error) reject(error)
      else resolve(value)
    }
  }
}

export default Network
