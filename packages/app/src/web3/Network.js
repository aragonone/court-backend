import Court from '@aragonone/celeste-backend-shared/models/Court'
import Environment from '@aragonone/celeste-backend-shared/models/environments/BrowserEnvironment'

const FAUCET = {
  staging: '0x9a2F850C701b457b73c8dC8B1534Cc187B33F5FD',
  ropsten: '0x83c1ECDC6fAAb783d9e3ac2C714C0eEce3349638',
  rinkeby: '0x5561f73c3BBe8202F4D7E51aD2A1F22f1E056eFE',
}

const ANT = {
  staging: '0x245B220211b7D3C6dCB001Aa2C3bf48ac4CaA03E',
  ropsten: '0x0cb95D9537c8Fb0C947eD48FDafc66A7b72EfC86',
  rinkeby: '0x8cf8196c14A654dc8Aceb3cbb3dDdfd16C2b652D',
  mainnet: '0x960b236A07cf122663c4303350609A66A7B288C0'
}

const Network = {
  get environment() {
    return new Environment(this.getNetworkName())
  },

  async query(query) {
    return this.environment.query(query)
  },

  async isEnabled() {
    return this.environment.isEnabled()
  },

  async getAccount() {
    return this.environment.getSender()
  },

  async getBalance(address) {
    const provider = await this.environment.getProvider()
    return provider.getBalance(address)
  },

  async getCourt(address) {
    if (!this.court) {
      const AragonCourt = await this.environment.getArtifact('AragonCourt', '@aragon/court')
      const court = await AragonCourt.at(address)
      this.court = new Court(court, this.environment)
    }
    return this.court
  },

  async getANT() {
    const antAddress = ANT[this.getNetworkName()]
    if (!this.ant && antAddress) {
      const MiniMeToken = await this.environment.getArtifact('MiniMeToken', '@aragon/minime')
      this.ant = await MiniMeToken.at(antAddress)
    }
    return this.ant
  },

  async getFaucet() {
    const faucetAddress = FAUCET[this.getNetworkName()]
    if (!this.faucet && faucetAddress) {
      const ERC20Faucet = await this.environment.getArtifact('ERC20Faucet', '@aragon/erc20-faucet')
      this.faucet = await ERC20Faucet.at(faucetAddress)
    }
    return this.faucet
  },

  async isCourtAt(address) {
    try {
      await this.getCourt(address)
      return true
    } catch (error) {
      if (error.message.includes(`no code at address ${address}`)) return false
      else throw error
    }
  },

  async isFaucetAvailable() {
    try {
      await this.getFaucet()
      return true
    } catch (error) {
      if (error.message.includes(`no code at address`)) return false
      else throw error
    }
  },

  getNetworkName() {
    const network = process.env.REACT_APP_NETWORK
    if (!network) throw Error('A network must be specified through a NETWORK env variables')
    return network
  },
}

export default Network
