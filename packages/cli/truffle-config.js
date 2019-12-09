const config = require('@aragon/truffle-config-v5/truffle-config')
const { networks: { rpc, ropsten, rinkeby, mainnet } } = config

rpc.court = undefined
ropsten.court = '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
rinkeby.court = '0x4ed496172778DbaBaee6393BA99f78E4e1f07821'
mainnet.court = '0xee4650cBe7a2B23701D416f58b41D8B76b617797'

module.exports = config
