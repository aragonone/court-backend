import Environment from '@aragon/court-backend-shared/models/evironments/LocalEnvironment'

const Network = {
  get environment() {
    return new Environment()
  },

  async getCourt() {
    return this.environment.getCourt()
  },

  async query(query) {
    return this.environment.query(query)
  },
}

export default Network
