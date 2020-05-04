import BaseModel from './BaseModel'

export default class UserEmailVerificationToken extends BaseModel {
  static get tableName() {
    return 'UserEmailVerificationTokens'
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'UserEmailVerificationTokens.userId',
          to: 'Users.id'
        },
      }
    }
  }
}
