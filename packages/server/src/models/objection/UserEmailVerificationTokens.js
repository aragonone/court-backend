const BaseModel = require('./BaseModel')
module.exports = class UserEmailVerificationTokens extends BaseModel {
  static get tableName() {
    return 'UserEmailVerificationTokens'
  }
  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Users',
        join: {
          from: 'UserEmailVerificationTokens.userId',
          to: 'Users.id'
        },
      }
    }
  }
}
