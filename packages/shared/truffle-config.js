const config = require('@aragon/truffle-config-v5/truffle-config')

// copy rinkeby config for staging
config.networks.staging = Object.assign({}, { ...config.networks.rinkeby })
config.networks.usability = Object.assign({}, { ...config.networks.rinkeby })

const { networks: { rpc, ropsten, rinkeby, usability, staging, mainnet } } = config

rpc.court = undefined
staging.court = '0xd0dcfc6b5b36f7e77f3daa2d9031b241651a6916'
ropsten.court = '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
rinkeby.court = '0xb5ffbe75fa785725eea5f931b64fc04e516c9c5d'
usability.court = '0x44f788370206696b20B94BC77c4f73Ca264aa05E'
mainnet.court = '0xee4650cBe7a2B23701D416f58b41D8B76b617797'

module.exports = config
