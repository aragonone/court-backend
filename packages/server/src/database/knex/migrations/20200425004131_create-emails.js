
exports.up = function(knex) {
  return knex.schema.createTable('KnexUserEmails', function (table) {
    table.increments('id')
    table.string('email')
    table.datetime('createdAt').defaultTo(knex.fn.now())
    table.datetime('updatedAt').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('KnexUserEmails')
}
