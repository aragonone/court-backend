
exports.up = function(knex) {
  return knex.schema.createTable('KnexSessions', function (table) {
    table.increments('id')
    table.string('sid').unique()
    table.jsonb('data')
    table.integer('adminId')   // no constraint while we migrate Admins
    table.integer('userId')
    table.foreign('userId').references('KnexUsers.id').onDelete('CASCADE')
    table.datetime('createdAt').defaultTo(knex.fn.now())
    table.datetime('updatedAt').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('KnexSessions')
}
