import Environment from '@aragon/court-backend-shared/models/evironments/TruffleEnvironment'

const NETWORK = process.env.NETWORK

const Network = {
  get environment() {
    return new Environment(NETWORK)
  },

  async getCourt() {
    return this.environment.getCourt()
  },
}

export default Network
