
export function up(knex) {
  return knex.schema.createTable('UserNotificationSettings', function (table) {
    table.increments('id')
    table.boolean('notificationsDisabled').defaultTo(false).notNullable()
    table.integer('userId').index().notNullable()
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex) {
  return knex.schema.dropTable('UserNotificationSettings')
}
