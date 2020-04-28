
exports.up = function(knex) {
  return knex.schema.hasTable('Admins').then(function(sequelizeExists) {
    if (sequelizeExists) {
      return knex.schema.alterTable('Admins', function (table) {
        table.datetime('createdAt').defaultTo(knex.fn.now()).alter()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).alter()
      })
    } else {
      return knex.schema.createTable('Admins', function (table) {
        table.increments('id')
        table.string('email').unique()
        table.string('password')
        table.datetime('createdAt').defaultTo(knex.fn.now())
        table.datetime('updatedAt').defaultTo(knex.fn.now())
      })
    }
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('Admins')
}
