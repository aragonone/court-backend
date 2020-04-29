import path from 'path'
const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: path.resolve(__dirname, './migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, './seeds'),
  },
}
export default config
export const {client, connection, migrations, seeds} = config // knex cli format
