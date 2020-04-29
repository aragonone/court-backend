
export function up(knex) {
  return knex.schema.hasTable('Admins').then(function(sequelizeExists) {
    if (sequelizeExists) {
      return knex.schema.alterTable('Admins', function (table) {
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable().alter()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable().alter()
      })
    } else {
      return knex.schema.createTable('Admins', function (table) {
        table.increments('id')
        table.string('email').unique().notNullable()
        table.string('password').notNullable()
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
      })
    }
  })
}

export function down(knex) {
  return knex.schema.dropTable('Admins')
}
