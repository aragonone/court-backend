import { Model } from 'objection'
import Knex from 'knex'

import config from '../../database/config'
Model.knex(Knex(config))

export default class BaseModel extends Model {
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

  static async exists(args) {
    return !!(await this.findOne(args))
  }

  static count(args) {
    return this.query().where(args).resultSize()
  }

  static findById(id) {
    return this.query().findById(id)
  }

  static findOne(args) {
    return this.query().findOne(args)
  }

  static async findOrInsert(args) {
    let row = await this.findOne(args)
    if (!row) row = await this.create(args)
    return row
  }

  static create(args = {}) {
    return this.query().insert(args)
  }
  

  // instance query methods (row level)
  
  async relatedUpdateOrInsert(relation, args) {
    const row = await this.$relatedQuery(relation)
    if (row) {
      await this.$relatedQuery(relation).update(args)
    } else {
      await this.$relatedQuery(relation).insert(args)
    }
  }
}
