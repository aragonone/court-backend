const config = require('@aragon/truffle-config-v5/truffle-config')
const { networks: { rpc, ropsten, rinkeby, mainnet } } = config

rpc.court = '0x21a59654176f2689d12E828B77a783072CD26680'
ropsten.court = '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
rinkeby.court = undefined
mainnet.court = '0xee4650cBe7a2B23701D416f58b41D8B76b617797'

module.exports = config
