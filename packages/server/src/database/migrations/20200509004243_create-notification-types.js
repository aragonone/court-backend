export function up(knex) {
  return knex.schema.createTable('UserNotificationTypes', function (table) {
    table.increments('id')
    table.string('type').unique().notNullable()
    table.datetime('scannedAt').index()
    table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex) {
  return knex.schema.dropTable('UserNotificationTypes')
}
