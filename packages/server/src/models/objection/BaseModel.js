const { Model } = require('objection')
const Knex = require('knex');
const config = require('../../database/knex/config')
Model.knex(Knex(config))
module.exports = class BaseModel extends Model {
  // modelPaths is used to allow modelClass relations be defined as a string to avoid require loops
  // https://vincit.github.io/objection.js/guide/relations.html#require-loops
  static get modelPaths() {
    return [__dirname];
  }
  // every child model should have updatedAt datetime field
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }

  // static query methods (table level)
  static async findOneOrInsert(args) {
    let row = await this.query().findOne(args)
    if (!row) row = await this.query().insert(args)
    return row
  }

  // instance query methods (row level)
  async $relatedUpdateOrInsert(relation, args) {
    const row = await this.$relatedQuery(relation)
    if (row) {
      await this.$relatedQuery(relation).update(args)
    } else {
      await this.$relatedQuery(relation).insert(args)
    }
  }
}
