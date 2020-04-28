const BaseModel = require('./BaseModel')
module.exports = class Sessions extends BaseModel {
  static get tableName() {
    return 'Sessions'
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Users',
        join: {
          from: 'Sessions.userId',
          to: 'Users.id'
        },
      }
    }
  }

  static async getData(sid) {
    const session = await this.query().findOne({sid})
    return session?.data
  }

  static async setData(sid, newData) {
    for (let prop of ['userId', 'adminId']) {
      if (newData.hasOwnProperty(prop)) {
        const row = {
          sid,
          data: newData,
          [prop]: newData[prop],
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
