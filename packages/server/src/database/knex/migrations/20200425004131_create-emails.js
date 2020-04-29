
export function up(knex) {
  return knex.schema.hasTable('Users').then(function(sequelizeExists) {
    if (sequelizeExists) {
      return knex.schema.renameTable('Users', 'UserEmails').alterTable('UserEmails', function (table) {
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable().alter()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable().alter()
      })
    } else {
      return knex.schema.createTable('UserEmails', function (table) {
        table.increments('id')
        table.string('email').unique().notNullable()
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
      })
    }
  })
}

export function down(knex) {
  return knex.schema.dropTable('UserEmails')
}
