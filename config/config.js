const path = require('path')
require('dotenv').config({path:path.join('..','.env')});
let DATABASE_URL
/* let host,username,password,database */
if(process.env.NODE_ENV === 'production'){
  DATABASE_URL = process.env.DATABASE_URL
/*   const dbUrlExtract = DATABASE_URL.slice(11)
  const extract = dbUrlExtract.split(":")
  username = extract[0]
  password = extract[1].split("@")[0]
  host = extract[1].split("@")[1]
  database = extract[2].split("/")[1] */
}
const creds = {
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "votingAppDB",
    /* "host": "127.0.0.1", */
    "host": "postgres",
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
    "use_env_variable": DATABASE_URL,
/*     "username": username,
    "password": password,
    "database": database,
    "host": host, */
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
