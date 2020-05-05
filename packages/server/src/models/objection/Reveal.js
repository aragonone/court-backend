import BaseModel from './BaseModel'

export default class Reveal extends BaseModel {
  static get tableName() {
    return 'Reveals'
  }

  static async create(params = {}) {
    return this.query().insert(params)
  }
}
