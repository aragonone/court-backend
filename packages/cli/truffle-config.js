const config = require('@aragon/truffle-config-v5/truffle-config')
const { networks: { rpc, ropsten, rinkeby, mainnet } } = config

rpc.court = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550'
ropsten.court = '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
rinkeby.court = undefined
mainnet.court = '0xee4650cBe7a2B23701D416f58b41D8B76b617797'

module.exports = config
