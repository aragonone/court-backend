import BaseModel from './BaseModel'

export default class Session extends BaseModel {
  static get tableName() {
    return 'Sessions'
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'Sessions.userId',
          to: 'Users.id'
        },
      },
      admin: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Admin',
        join: {
          from: 'Sessions.adminId',
          to: 'Admins.id'
        },
      }
    }
  }

  static async getData(sid) {
    const session = await this.findOne({sid})
    return session?.data
  }

  static async setData(sid, newData) {
    for (let prop of ['userId', 'adminId']) {
      if (newData.hasOwnProperty(prop)) {
        const row = {
          sid,
          data: newData,
          [prop]: newData[prop],
          expiresAt: newData.cookie._expires
        }
        const sessionData = await this.getData(sid)
        if (sessionData) {
          await this.query().where({sid}).update(row)
        } else {
          await this.query().insert(row)
        }
      }
    }
  }
}
