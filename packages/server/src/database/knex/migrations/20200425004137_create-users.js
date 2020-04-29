
export function up(knex) {
  return knex.schema.hasTable('UserAddresses').then(function(sequelizeExists) {
    if (sequelizeExists) {
      return knex.schema.renameTable('UserAddresses', 'Users').alterTable('Users', function (table) {
        table.boolean('addressVerified').defaultTo(false).notNullable()
        table.renameColumn('userId', 'userEmailId')
        table.dropForeign('userEmailId', 'UserAddresses_userId_fkey') // need to recreate constraint with set null on delete
        table.foreign('userEmailId').references('UserEmails.id').onDelete('SET NULL')
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable().alter()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable().alter()
      })
    } else {
      return knex.schema.createTable('Users', function (table) {
        table.increments('id')
        table.string('address').unique().notNullable()
        table.boolean('addressVerified').defaultTo(false).notNullable()
        table.integer('userEmailId')
        table.foreign('userEmailId').references('UserEmails.id').onDelete('SET NULL')
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
      })
    }
  })
}

export function down(knex) {
  return knex.schema.dropTable('Users')
}
