const Sequelize = require('sequelize')
const config = require('../config/databaseConfig.js');

var sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  },
  define: {
    timestamps: false
  },
  logging: false
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database: ', err)
  })

module.exports = sequelize;
