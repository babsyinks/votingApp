const databaseCredentials = require("../../config/config");

describe("Database config", () => {
  it("should export an object with development, test, and production keys", () => {
    expect(databaseCredentials).toHaveProperty("development");
    expect(databaseCredentials).toHaveProperty("test");
    expect(databaseCredentials).toHaveProperty("production");
  });

  it("should have correct development config", () => {
    expect(databaseCredentials.development).toEqual({
      username: "postgres",
      password: "postgres",
      database: "votingAppDB",
      host: "127.0.0.1",
      dialect: "postgres",
    });
  });

  it("should have correct test config", () => {
    expect(databaseCredentials.test).toEqual({
      username: "root",
      password: null,
      database: "database_test",
      host: "127.0.0.1",
      dialect: "postgres",
    });
  });

  it("should have correct production config", () => {
    expect(databaseCredentials.production).toMatchObject({
      use_env_variable: "DATABASE_URL",
      dialect: "postgres",
      protocol: "postgres",
    });

    expect(databaseCredentials.production.dialectOptions).toHaveProperty("ssl");
    expect(databaseCredentials.production.dialectOptions.ssl).toMatchObject({
      require: true,
      rejectUnauthorized: false,
    });
  });
});
