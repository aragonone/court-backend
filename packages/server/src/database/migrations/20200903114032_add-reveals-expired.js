export function up(knex) {
  return knex.schema.alterTable('Reveals', function (table) {
    table.boolean('expired').notNullable().defaultTo(false)
  })
}

export function down(knex) {
  return knex.schema.alterTable('Reveals', function (table) {
    table.dropColumn('expired')
  })
}
