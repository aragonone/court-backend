const config = require('../../truffle-config')
const Environment = require('./Environment')
const Court = require('@aragon/court-backend-shared/models/Court')

module.exports = class {
  static async for(network, sender = undefined) {
    const networkConfig = config.networks[network] || { court: undefined }
    const { court: address } = networkConfig
    if (!address) throw Error(`Missing court address for network ${network}`)

    const environment = new Environment(network, sender)
    const AragonCourt = await environment.getArtifact('AragonCourt', '@aragon/court')
    const court = await AragonCourt.at(address)
    return new Court(court, environment)
  }
}
