const config = require('@aragon/truffle-config-v5/truffle-config')
const { networks: { rpc, ropsten, rinkeby, mainnet } } = config

rpc.court = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550'
ropsten.court = '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
rinkeby.court = undefined
mainnet.court = '0xee4650cBe7a2B23701D416f58b41D8B76b617797'

module.exports = config


const homedir = require("os").homedir;
const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider')

const DEFAULT_MNEMONIC =
  "explain tackle mirror kit van hammer degree position ginger unfair soup bonus";

const defaultRPC = network => `https://${network}.eth.aragon.network`;

const configFilePath = filename => path.join(homedir(), `.aragon/${filename}`)

const mnemonic = () => {
  try {
    return require(configFilePath("mnemonic.json")).mnemonic;
  } catch (e) {
    return DEFAULT_MNEMONIC;
  }
};

const settingsForNetwork = network => {
  try {
    return require(configFilePath(`${network}_key.json`));
  } catch (e) {
    return {};
  }
};

// Lazily loaded provider
const providerForNetwork = network => () => {
  let { rpc, keys } = settingsForNetwork(network);
  rpc = rpc || defaultRPC(network);

  if (!keys || keys.length === 0) {
    return new HDWalletProvider(mnemonic(), rpc);
  }

  return new HDWalletProvider(keys, rpc);
};

module.exports = {
  rpc: {
    network_id: 15,
    host: 'localhost',
    port: 8545,
    gas: 6.9e6,
    gasPrice: 15000000001,
    court: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550'
  },
  mainnet: {
    network_id: 1,
    provider: providerForNetwork('mainnet'),
    gas: 7.9e6,
    gasPrice: 10e9,
    court: '0xee4650cBe7a2B23701D416f58b41D8B76b617797'
  },
  ropsten: {
    network_id: 3,
    provider: providerForNetwork('ropsten'),
    gas: 7.9e6,
    gasPrice: 10e9,
    court: '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
  },
  rinkeby: {
    network_id: 4,
    provider: providerForNetwork('rinkeby'),
    gas: 6.9e6,
    gasPrice: 10e9,
    court: undefined
  }
}
