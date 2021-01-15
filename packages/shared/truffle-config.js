const config = require('@aragon/truffle-config-v5/truffle-config')

// copy rinkeby config for staging
config.networks.staging = Object.assign({}, { ...config.networks.rinkeby })

const { networks: { rpc, ropsten, rinkeby, staging, mainnet } } = config

rpc.court = undefined
staging.court = '0x52180af656a1923024d1accf1d827ab85ce48878'
ropsten.court = '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
rinkeby.court = '0xdA4d0E51dD16D0b2A0baA81aE48D990926958B28'
mainnet.court = '0xee4650cBe7a2B23701D416f58b41D8B76b617797'

module.exports = config
