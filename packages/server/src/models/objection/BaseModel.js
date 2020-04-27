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
}
