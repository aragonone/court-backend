
export function up(knex) {
  return knex.schema.createTable('UserEmailVerificationTokens', function (table) {
    table.increments('id')
    table.string('email').notNullable()
    table.string('token').notNullable()
    table.integer('userId').notNullable()
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex) {
  return knex.schema.dropTable('UserEmailVerificationTokens')
}
