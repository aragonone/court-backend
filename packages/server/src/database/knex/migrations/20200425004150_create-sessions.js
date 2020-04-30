
export function up(knex) {
  return knex.schema.dropTableIfExists('Sessions').createTable('Sessions', function (table) {
    table.increments('id')
    table.string('sid').unique().notNullable()
    table.jsonb('data').notNullable()
    table.integer('adminId').index()
    table.foreign('adminId').references('Admins.id').onDelete('CASCADE')
    table.integer('userId').index()
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.datetime('expiresAt').index().notNullable()
    table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  }).raw('ALTER TABLE "Sessions" ADD CONSTRAINT "admin_or_user" CHECK (("adminId" IS NOT NULL AND "userId" IS NULL) OR ("userId" IS NOT NULL AND "adminId" IS NULL));')
}

export function down(knex) {
  return knex.schema.dropTable('Sessions')
}
