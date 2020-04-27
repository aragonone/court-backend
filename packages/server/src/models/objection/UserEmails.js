const BaseModel = require('./BaseModel')
module.exports = class UserEmails extends BaseModel {
  static get tableName() {
    return 'KnexUserEmails'
  }
  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Users',
        join: {
          from: 'KnexUserEmails.id',
          to: 'KnexUsers.userEmailId'
        }
      }
    }
  }
}
