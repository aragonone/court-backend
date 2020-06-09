export function up(knex) {
  return knex.schema.alterTable('Reveals', function (table) {
    table.integer('failedAttempts').notNullable().defaultTo(0)
  })
}

export function down(knex) {
  return knex.schema.alterTable('Reveals', function (table) {
    table.dropColumn('failedAttempts')
  })
}
