const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];


const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Render requires this for SSL connections
        },
      },
    })
  : new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize;
