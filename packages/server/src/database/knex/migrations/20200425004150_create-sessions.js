
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('Sessions').createTable('Sessions', function (table) {
    table.increments('id')
    table.string('sid').unique()
    table.jsonb('data')
    table.integer('adminId')
    table.foreign('adminId').references('Admins.id').onDelete('CASCADE')
    table.integer('userId')
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.datetime('createdAt').defaultTo(knex.fn.now())
    table.datetime('updatedAt').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('Sessions')
}
