export function up(knex) {
  return knex.schema.createTable('UserNotifications', function (table) {
    table.increments('id')
    table.jsonb('details').index()
    table.datetime('sentAt').index()
    table.integer('userNotificationTypeId').index().notNullable()
    table.foreign('userNotificationTypeId').references('UserNotificationTypes.id').onDelete('CASCADE')
    table.integer('userId').index().notNullable()
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex) {
  return knex.schema.dropTable('UserNotifications')
}
