const BaseModel = require('./BaseModel')
module.exports = class Reveals extends BaseModel {
  static get tableName() {
    return 'Reveals'
  }
}
