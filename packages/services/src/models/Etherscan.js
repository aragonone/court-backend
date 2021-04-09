import axios from 'axios'
import { bn } from '@1hive/celeste-backend-shared/helpers/numbers'

const BASE_URL = 'https://<network>.etherscan.io/api?'
const DEFAULT_API_KEY = process.env.ETHERSCAN_API_KEY

export default class Etherscan {
  constructor(network = 'mainnet', key = DEFAULT_API_KEY) {
    this.key = key
    this.url = this._getBaseUrl(network)
  }

  async getBalance(address) {
    const path = `${this.url}module=account&action=balance&address=${address}&tag=latest`
    const response = await this._get(path)
    if (response.status !== '1' || !response.result) throw Error(`Received error from Etherscan: ${JSON.stringify(response)}`)
    return bn(response.result)
  }

  async getTransactionsFrom(address, fromBlock = 0) {
    const path = `${this.url}module=account&action=txlist&address=${address}&startblock=${fromBlock}&sort=desc`
    const response = await this._get(path)

    if ((response.status !== '1' && response.message !== 'No transactions found') || !response.result)
      throw Error(`Received error from Etherscan: ${JSON.stringify(response)}`)

    return response.result
      .filter(({ from }) => from === address)
      .map(tx => ({...tx, to: tx.to.toLowerCase() }))
  }

  async _get(url) {
    const { data } = await axios.get(`${url}&apikey=${this.key}`)
    return data
  }

  _getBaseUrl(network) {
    if (network === 'rinkeby' || network === 'ropsten') return BASE_URL.replace('<network>', `api-${network}`)
    else if (network === 'staging') return BASE_URL.replace('<network>', 'api-rinkeby')
    else if (network == 'xdai') return 'https://blockscout.com/xdai/mainnet/api?'
    return BASE_URL.replace('<network>', 'api')
  }
}
