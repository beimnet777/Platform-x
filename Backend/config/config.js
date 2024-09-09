require('dotenv').config({ path : `${process.cwd()}/.env`})

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password:  process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    host:  process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    use_env_variable: 'DATABASE_URL',  // This will use the DATABASE_URL from Render
    dialect : 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Render
      },
    },
  }
}
