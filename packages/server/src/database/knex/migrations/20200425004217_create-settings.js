
exports.up = function(knex) {
  return knex.schema.createTable('KnexUserNotificationSettings', function (table) {
    table.increments('id')
    table.boolean('notificationsDisabled').defaultTo(false)
    table.integer('userId')
    table.foreign('userId').references('KnexUsers.id').onDelete('CASCADE')
    table.datetime('createdAt').defaultTo(knex.fn.now())
    table.datetime('updatedAt').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('KnexUserNotificationSettings')
}
