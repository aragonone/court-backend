import bcrypt from 'bcryptjs'
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

  static async countByEmail(email) {
    return this.query().where({ email }).count()
  }

  static async findByEmail(email) {
    return this.query().findOne({ email })
  }

  static async findAllEmails() {
    const admins = await this.query().select('email')
    return admins.map(admin => admin.email)
  }

  hasPassword(password) {
    return bcrypt.compareSync(password, this.password)
  }

  hashPassword() {
    this.password = bcrypt.hashSync(this.password)
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext)
    this.hashPassword()
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext)
    this.hashPassword()
  }
}
