
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('Sessions').createTable('Sessions', function (table) {
    table.increments('id')
    table.string('sid').unique().notNullable()
    table.jsonb('data').notNullable()
    table.integer('adminId')
    table.foreign('adminId').references('Admins.id').onDelete('CASCADE')
    table.integer('userId')
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('Sessions')
}
