const path = require('path')
require('dotenv').config({path:path.join('..','.env')});

const creds = {
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "votingAppDB",
    "host": "127.0.0.1",
    "dialect": "postgres" 
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOSTNAME,
    "dialect": "postgres",
    dialectOptions: {
      ssl: {     
        require: true,
        rejectUnauthorized: false 
      }
    }
  }
}

module.exports = creds;
