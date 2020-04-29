import BaseModel from './BaseModel'
export default class Admins extends BaseModel {
  static get tableName() {
    return 'Admins'
  }
  static get relationMappings() {
    return {
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Sessions',
        join: {
          from: 'Admins.id',
          to: 'Sessions.adminId'
        }
      }
    }
  }
}
