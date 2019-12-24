import Court from '@aragon/court-backend-shared/models/Court'
import Environment from '@aragon/court-backend-shared/models/evironments/MetamaskEnvironment'

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT

const FAUCET = {
  staging: '0x7E9152F2eFDF6a862FeecDc8b0fb892dA6f60dEe',
  ropsten: '0x83c1ECDC6fAAb783d9e3ac2C714C0eEce3349638',
  rinkeby: '0x3b86Fd8C30445Ddcbed79CE7eB052fe935D34Fd2'
}

const ANT = {
  staging: '0xd6257606740DE4A457B97D5DD469021ED72b6Ae7',
  ropsten: '0x0cb95D9537c8Fb0C947eD48FDafc66A7b72EfC86',
  rinkeby: '0x5cC7986D7A793b9930BD80067ca54c3E6D2F261B',
  mainnet: '0x960b236A07cf122663c4303350609A66A7B288C0'
}

const Network = {
  get environment() {
    return new Environment()
  },

  async getWeb3() {
    return this.environment.getWeb3()
  },

  async isEnabled() {
    return this.environment.isEnabled()
  },

  async getAccount() {
    return this.environment.getSender()
  },

  async getBalance(address) {
    const web3 = await this.getWeb3()
    return new Promise((resolve, reject) =>
      web3.eth.getBalance(address, (error, value) =>
        error ? reject(error) : resolve(value)))
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

  async query(query) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query })
    })
    const json = await response.json()
    return json.data
  },

  getNetworkName() {
    if (GRAPHQL_ENDPOINT.includes('staging')) return 'staging'
    else if (GRAPHQL_ENDPOINT.includes('ropsten')) return 'ropsten'
    else if (GRAPHQL_ENDPOINT.includes('rinkeby')) return 'rinkeby'
    else return 'mainnet'
  },
}

export default Network
