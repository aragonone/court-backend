
exports.up = function(knex) {
  return knex.schema.createTable('KnexUsers', function (table) {
    table.increments('id')
    table.string('address').unique()
    table.boolean('addressVerified').defaultTo(false)
    table.integer('userEmailId')
    table.foreign('userEmailId').references('KnexUserEmails.id').onDelete('SET NULL')
    table.datetime('createdAt').defaultTo(knex.fn.now())
    table.datetime('updatedAt').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('KnexUsers')
}
