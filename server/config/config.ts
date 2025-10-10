interface BaseConfig {
  dialect: "postgres";
  host?: string;
}

interface DevTestConfig extends BaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
}

interface ProdConfig extends BaseConfig {
  use_env_variable: string;
  protocol: "postgres";
  dialectOptions: {
    ssl: {
      require: true;
      rejectUnauthorized: false;
    };
  };
}

type DBConfig = {
  development: DevTestConfig;
  test: DevTestConfig;
  production: ProdConfig;
};

const databaseCredentials: DBConfig = {
  development: {
    username: "postgres",
    password: "postgres",
    database: "votingAppDB",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "root",
    password: "test",
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
export default databaseCredentials;
