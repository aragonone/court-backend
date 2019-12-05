import Web3 from 'web3'
import CourtProvider from './CourtProvider'

const COURT_ADDRESS = process.env.REACT_APP_COURT_ADDRESS
const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT
const WEB3_HTTP_PROVIDER = process.env.REACT_APP_WEB3_HTTP_PROVIDER

const Network = {
  async getCourt() {
    if (!this.court) this.court = await CourtProvider.for(this.getProvider(), COURT_ADDRESS)
    return this.court
  },

  getWeb3() {
    if (!this.web3) this.web3 = new Web3(this.getProvider())
    return this.web3
  },

  getProvider() {
    if (!this.provider) this.provider = window.web3
      ? window.web3.currentProvider
      : new Web3.providers.HttpProvider(WEB3_HTTP_PROVIDER)
    return this.provider
  },

  async getAccount() {
    const accounts = await this.getAccounts()
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

  async query(query) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query })
    })
    const json = await response.json()
    return json.data
  },

  _web3Callback(resolve, reject) {
    return function (error, value) {
      if (error) reject(error)
      else resolve(value)
    }
  }
}

export default Network
