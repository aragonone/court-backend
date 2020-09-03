const axios = require('axios')

const GAS_STATION_API_URL = 'https://ethgasstation.info/json/ethgasAPI.json'

const DEFAULT_TESTNET_GAS_PRICE = 10e9

const MAINNET_ID = 1
const TESTNET_IDS = [3, 4, 42] // ropsten, rinkeby and kovan

module.exports = {
  async fetch(networkId) {
    if (MAINNET_ID === networkId) return this._fetchMainnetGasPrice()
    if (TESTNET_IDS.includes(networkId)) return DEFAULT_TESTNET_GAS_PRICE
    return undefined
  },

  async _fetchMainnetGasPrice() {
    try {
      const { data: responseData } = await axios.get(GAS_STATION_API_URL)
      return (responseData.fastest / 10) * 1e9
    } catch (error) {
      console.error(`Could not fetch gas price from ETH gas station: ${error}`)
      return 0
    }
  }
}
