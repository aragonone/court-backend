
export function up(knex) {
  return knex.schema.hasTable('Reveals').then(function(sequelizeExists) {
    if (sequelizeExists) {
      return knex.schema.alterTable('Reveals', function (table) {
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable().alter()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable().alter()
      })
    } else {
      return knex.schema.createTable('Reveals', function (table) {
        table.increments('id')
        table.string('voteId').notNullable()
        table.string('juror').notNullable()
        table.unique(['juror', 'voteId'])
        table.string('disputeId').notNullable()
        table.integer('roundNumber').notNullable()
        table.integer('outcome').notNullable()
        table.string('salt').notNullable()
        table.boolean('revealed').defaultTo(false).notNullable()
        table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
        table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
      })
    }
  })
}

export function down(knex) {
  return knex.schema.dropTable('Reveals')
}
