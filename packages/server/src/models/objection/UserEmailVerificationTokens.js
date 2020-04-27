const BaseModel = require('./BaseModel')
module.exports = class UserEmailVerificationTokens extends BaseModel {
  static get tableName() {
    return 'KnexUserEmailVerificationTokens'
  }
  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Users',
        join: {
          from: 'KnexUserEmailVerificationTokens.userId',
          to: 'KnexUsers.id'
        },
      }
    }
  }
}
