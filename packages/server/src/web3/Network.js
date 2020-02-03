import Environment from '@aragon/court-backend-shared/models/evironments/LocalEnvironment'

const Network = {
  get environment() {
    return new Environment()
  },

  async getCourt() {
    return this.environment.getCourt()
  },
}

export default Network
