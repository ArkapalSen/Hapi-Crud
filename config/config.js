require("dotenv").config();
module.exports = {
  
  development: {
    username: process.env.LOCAL_DB_USERNAME,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_DATABASE,
    host: process.env.LOCAL_HOST,
    dialect: process.env.LOCAL_DB_CONNECTION,
  },
  test: {
    username: "root",
    password: null,
    database: "sequelize_crud",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    // "username": "root",
    // "password": null,
    // "database": "sequelize_crud",
    // "host": "127.0.0.1",
    // "dialect": "mysql"
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_DATABASE,
    host: process.env.PROD_HOST,
    dialect: process.env.PROD_DB_CONNECTION,
  },

}
