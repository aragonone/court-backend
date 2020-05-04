import BaseModel from './BaseModel'
export default class UserEmail extends BaseModel {
  static get tableName() {
    return 'UserEmails'
  }
  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'User',
        join: {
          from: 'UserEmails.id',
          to: 'Users.userEmailId'
        }
      }
    }
  }
}
