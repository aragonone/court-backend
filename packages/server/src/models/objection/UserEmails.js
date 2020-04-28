const BaseModel = require('./BaseModel')
module.exports = class UserEmails extends BaseModel {
  static get tableName() {
    return 'UserEmails'
  }
  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Users',
        join: {
          from: 'UserEmails.id',
          to: 'Users.userEmailId'
        }
      }
    }
  }
}
