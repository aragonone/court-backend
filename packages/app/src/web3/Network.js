import Web3 from 'web3'
import sleep from '../helpers/sleep'
import Environment from './Environment'
import Court from "@aragon/court-backend-shared/models/Court";

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
  async query(query) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query })
    })
    const json = await response.json()
    return json.data
  },

  async getAccount() {
    return window.web3.currentProvider.selectedAddress
  },

  async getCourt(address) {
    if (!this.court) {
      const environment = await this.getEnvironment()
      const AragonCourt = await environment.getArtifact('AragonCourt', '@aragon/court')
      const court = await AragonCourt.at(address)
      this.court = new Court(court, environment)
    }
    return this.court
  },

  async getANT() {
    const antAddress = ANT[this.getNetworkName()]
    if (!this.ant && antAddress) {
      const environment = await this.getEnvironment()
      const MiniMeToken = await environment.getArtifact('MiniMeToken', '@aragon/minime')
      this.ant = await MiniMeToken.at(antAddress)
    }
    return this.ant
  },

  async getFaucet() {
    const faucetAddress = FAUCET[this.getNetworkName()]
    if (!this.faucet && faucetAddress) {
      const environment = await this.getEnvironment()
      const ERC20Faucet = await environment.getArtifact('ERC20Faucet', '@aragon/erc20-faucet')
      this.faucet = await ERC20Faucet.at(faucetAddress)
    }
    return this.faucet
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

  async isCourtAt(address) {
    try {
      await this.getCourt(address)
      return true
    } catch (error) {
      if (error.message.includes(`no code at address ${address}`)) return false
      else throw error
    }
  },

  async getBalance(address) {
    const web3 = await this.getWeb3()
    return new Promise((resolve, reject) =>
      web3.eth.getBalance(address, (error, value) =>
        error ? reject(error) : resolve(value)))
  },

  async getWeb3() {
    if (!this.web3) {
      const provider = await this.getProvider()
      this.web3 = new Web3(provider)
    }
    return this.web3
  },

  async getProvider() {
    if (!this.provider) {
      if (this.isEnabled()) this.provider = window.web3.currentProvider
      else throw Error('Could not access to a browser web3 provider, please make sure to allow one.')
      this.provider.setMaxListeners(300)
    }
    return this.provider
  },

  async getEnvironment() {
    if (!this.environment) {
      const sender = await this.getAccount()
      const provider = await this.getProvider()
      this.environment = new Environment(provider, sender)
    }
    return this.environment
  },

  async isEnabled() {
    await sleep(2)
    const { web3 } = window
    return !!(web3 && web3.currentProvider && web3.currentProvider.selectedAddress)
  },

  getNetworkName() {
    if (GRAPHQL_ENDPOINT.includes('staging')) return 'staging'
    else if (GRAPHQL_ENDPOINT.includes('ropsten')) return 'ropsten'
    else if (GRAPHQL_ENDPOINT.includes('rinkeby')) return 'rinkeby'
    else return 'mainnet'
  }
}

export default Network
