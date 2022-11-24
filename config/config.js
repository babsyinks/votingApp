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
    "use_env_variable": 'DATABASE_URL',
/*     "username": username,
    "password": password,
    "database": database,
    "host": host, */
    "dialect": "postgres",
    "protocol":"postgres",
    dialectOptions: {
      ssl: {     
        require: true,
        rejectUnauthorized: false 
      }
    }
  }
}
module.exports = creds;
