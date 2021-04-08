const config = require('@aragon/truffle-config-v5/truffle-config')
const HDWalletProvider = require("@truffle/hdwallet-provider");

// copy rinkeby config for staging
config.networks.staging = Object.assign({}, { ...config.networks.rinkeby })
config.networks.xdai = Object.assign({}, {
    network_id: 100,
    provider: new HDWalletProvider([process.env.PRIVATE_KEY], process.env.RPC),
    gas: 6.9e6,
    gasPrice: 1000000000
  })

const { networks: { rpc, ropsten, rinkeby, staging, mainnet, xdai } } = config

rpc.court = undefined
staging.court = '0x52180af656a1923024d1accf1d827ab85ce48878'
ropsten.court = '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
rinkeby.court = '0x35e7433141D5f7f2EB7081186f5284dCDD2ccacE'
mainnet.court = '0xee4650cBe7a2B23701D416f58b41D8B76b617797'
xdai.court = '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85'

module.exports = config
