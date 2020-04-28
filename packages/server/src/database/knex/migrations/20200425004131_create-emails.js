
exports.up = function(knex) {
  return knex.schema.hasTable('Users').then(function(sequelizeExists) {
    if (sequelizeExists) {
      return knex.schema.renameTable('Users', 'UserEmails').alterTable('UserEmails', function (table) {
        table.datetime('createdAt').defaultTo(knex.fn.now()).alter()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).alter()
      })
    } else {
      return knex.schema.createTable('UserEmails', function (table) {
        table.increments('id')
        table.string('email').unique()
        table.datetime('createdAt').defaultTo(knex.fn.now())
        table.datetime('updatedAt').defaultTo(knex.fn.now())
      })
    }
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('UserEmails')
}
