export function up(knex) {
  return knex.schema.hasTable('KeeperSuspiciousTransactions').then(function(sequelizeExists) {
    if (sequelizeExists) {
      return knex.schema.alterTable('KeeperSuspiciousTransactions', function (table) {
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable().alter()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable().alter()
      })
    } else {
      return knex.schema.createTable('KeeperSuspiciousTransactions', function (table) {
        table.increments('id')
        table.string('blockNumber').unique().notNullable()
        table.string('txHash').unique().nullable()
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
      })
    }
  })
}

export function down(knex) {
  return knex.schema.dropTable('KeeperSuspiciousTransactions')
}
