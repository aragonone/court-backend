
exports.up = function(knex) {
  return knex.schema.hasTable('Reveals').then(function(sequelizeExists) {
    if (sequelizeExists) {
      return knex.schema.alterTable('Reveals', function (table) {
        table.datetime('createdAt').defaultTo(knex.fn.now()).alter()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).alter()
      })
    } else {
      return knex.schema.createTable('Reveals', function (table) {
        table.increments('id')
        table.string('voteId')
        table.string('juror')
        table.unique(['juror', 'voteId'])
        table.string('disputeId')
        table.integer('roundNumber')
        table.integer('outcome')
        table.string('salt')
        table.boolean('revealed').defaultTo(false)
        table.datetime('createdAt').defaultTo(knex.fn.now())
        table.datetime('updatedAt').defaultTo(knex.fn.now())
      })
    }
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('Reveals')
}
