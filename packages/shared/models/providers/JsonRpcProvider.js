const ethers = require('ethers')
const logger = require('../../helpers/logger')('Provider')

class JsonRpcProvider extends ethers.providers.JsonRpcProvider {
  constructor(url, network) {
    super(url, network)
  }

  send(method, params) {
    logger.info(`Sending RPC request '${method}'`)
    return super.send(method, params)
  }
}

module.exports = JsonRpcProvider
