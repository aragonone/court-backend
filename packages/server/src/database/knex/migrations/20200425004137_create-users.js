
exports.up = function(knex) {
  return knex.schema.hasTable('UserAddresses').then(function(sequelizeExists) {
    if (sequelizeExists) {
      return knex.schema.renameTable('UserAddresses', 'Users').alterTable('Users', function (table) {
        table.boolean('addressVerified').defaultTo(false)
        table.renameColumn('userId', 'userEmailId')
        table.dropForeign('userEmailId', 'UserAddresses_userId_fkey') // need to recreate constraint with set null on delete
        table.foreign('userEmailId').references('UserEmails.id').onDelete('SET NULL')
        table.datetime('createdAt').defaultTo(knex.fn.now()).alter()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).alter()
      })
    } else {
      return knex.schema.createTable('Users', function (table) {
        table.increments('id')
        table.string('address').unique()
        table.boolean('addressVerified').defaultTo(false)
        table.integer('userEmailId')
        table.foreign('userEmailId').references('UserEmails.id').onDelete('SET NULL')
        table.datetime('createdAt').defaultTo(knex.fn.now())
        table.datetime('updatedAt').defaultTo(knex.fn.now())
      })
    }
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('Users')
}
