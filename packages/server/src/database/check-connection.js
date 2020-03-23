import db from '../models'

export default async function checkConnection() {
  try {
    await db.sequelize.authenticate()
    console.log('Database connection has been established successfully')
  } catch(error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}
