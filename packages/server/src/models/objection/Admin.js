import BaseModel from './BaseModel'
export default class Admin extends BaseModel {
  static get tableName() {
    return 'Admins'
  }
  static get relationMappings() {
    return {
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Session',
        join: {
          from: 'Admins.id',
          to: 'Sessions.adminId'
        }
      }
    }
  }
}
