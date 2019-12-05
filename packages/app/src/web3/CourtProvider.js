import Environment from './Environment'
import Court from '@aragon/court-backend-shared/models/Court'

export default class {
  static async for(provider, address) {
    const environment = new Environment(provider)
    const AragonCourt = await environment.getArtifact('AragonCourt', '@aragon/court')
    const court = await AragonCourt.at(address)
    return new Court(court, environment)
  }
}
