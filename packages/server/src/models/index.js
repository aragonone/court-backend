import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import databaseConfig from '../database/config'

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
const config = databaseConfig[env]

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password, {
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    dialectOption: {
      ssl: true,
      native: true
    },
    logging: config.logging
  }
)

const db = {}
const basename = path.basename(__filename)

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
