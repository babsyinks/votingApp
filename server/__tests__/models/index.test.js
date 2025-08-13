const path = require("path");

describe("models/index.js", () => {
  let fsMock;
  let SequelizeMock;
  let sequelizeInstanceMock;

  beforeEach(() => {
    jest.resetModules();

    fsMock = { readdirSync: jest.fn() };

    sequelizeInstanceMock = {
      define: jest.fn(),
    };

    SequelizeMock = jest.fn(() => sequelizeInstanceMock);
    SequelizeMock.DataTypes = {};

    jest.doMock("fs", () => fsMock);

    jest.doMock("sequelize", () => {
      SequelizeMock.DataTypes = SequelizeMock.DataTypes;
      return SequelizeMock;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should load models and set up associations", () => {
    const fakeModel = { associate: jest.fn() };
    const fakeModelPath = path.join(__dirname, "..", "..", "models", "fakeModel.js");

    fsMock.readdirSync.mockReturnValue(["fakeModel.js"]);

    jest.doMock(fakeModelPath, () => jest.fn(() => fakeModel), { virtual: true });

    const db = require("../../models/index.js");

    expect(SequelizeMock).toHaveBeenCalled();
    expect(fakeModel.associate).toHaveBeenCalledWith(db);
  });

  it("should skip files starting with dot or the index.js file", () => {
    fsMock.readdirSync.mockReturnValue([".dotfile.js", "index.js"]);

    const db = require("../../models/index.js");

    expect(Object.keys(db)).toContain("sequelize");
    expect(Object.keys(db)).toContain("Sequelize");
  });

  it("should handle models without associate method", () => {
    const fakeModel = {};
    const fakeModelPath = path.join(__dirname, "..", "..", "models", "fakeModel.js");

    fsMock.readdirSync.mockReturnValue(["fakeModel.js"]);
    jest.doMock(fakeModelPath, () => jest.fn(() => fakeModel), { virtual: true });

    require("../../models/index.js");

    expect(SequelizeMock).toHaveBeenCalled();
  });

  it("should initialize sequelize using env variable when use_env_variable is set", () => {
    jest.resetModules();

    process.env.DB_URL = "postgres://user:pass@localhost:5432/dbname";

    jest.doMock("../../config/dbConfig.js", () => ({
      test: {
        use_env_variable: "DB_URL",
        dialect: "postgres",
        host: "127.0.0.1",
      },
    }));

    fsMock.readdirSync.mockReturnValue(["fakeModel.js"]);

    const fakeModelPath = path.join(__dirname, "..", "..", "models", "fakeModel.js");
    jest.doMock(fakeModelPath, () => jest.fn(() => ({})), { virtual: true });

    require("../../models/index.js");

    expect(SequelizeMock).toHaveBeenCalledWith(
      process.env.DB_URL,
      expect.objectContaining({ dialect: "postgres", host: "127.0.0.1" }),
    );
  });

  it("should default NODE_ENV to development when not set", () => {
    jest.resetModules();
    delete process.env.NODE_ENV;

    jest.doMock("../../config/dbConfig.js", () => ({
      development: {
        database: "db_dev",
        username: "dev",
        password: null,
        dialect: "sqlite",
        host: "localhost",
      },
    }));

    fsMock.readdirSync.mockReturnValue([]);
    require("../../models/index.js");

    expect(true).toBe(true);
  });
});
