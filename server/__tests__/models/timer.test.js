const { DataTypes } = require("sequelize");

jest.mock("sequelize", () => {
  const actual = jest.requireActual("sequelize");

  class MockModel {
    static init(attributes, options) {
      this.rawAttributes = attributes;
      this.options = options;
      return this;
    }
    static belongsTo(model, options) {
      this.belongsToCall = { model, options };
    }
    get() {
      return this.dataValues || {};
    }
  }

  return {
    ...actual,
    Model: MockModel,
    DataTypes: {
      ...actual.DataTypes,
      UUID: { key: "UUID" },
      UUIDV4: { key: "UUIDV4" },
      DATE: { key: "DATE" },
    },
  };
});

describe("Timer Model (unit)", () => {
  let Timer;
  let mockSequelize;

  beforeAll(() => {
    mockSequelize = {};
    Timer = require("../../models/timer")(mockSequelize, DataTypes);
  });

  test("should have correct model name and table name", () => {
    expect(Timer.options.modelName).toBe("Timer");
    expect(Timer.options.tableName).toBe("timers");
  });

  test("should define correct attributes", () => {
    const attrs = Timer.rawAttributes;

    expect(attrs.timer_id.type.key).toBe("UUID");
    expect(attrs.timer_id.defaultValue.key).toBe("UUIDV4");
    expect(attrs.timer_id.primaryKey).toBe(true);

    expect(attrs.election_id.type.key).toBe("UUID");
    expect(attrs.election_id.allowNull).toBe(false);
    expect(attrs.election_id.unique).toBe(true);

    expect(attrs.startDate.key).toBe("DATE");
    expect(attrs.endDate.key).toBe("DATE");
  });

  test("associate should define relationship with Election", () => {
    const mockElectionModel = {};
    Timer.associate({ Election: mockElectionModel });

    expect(Timer.belongsToCall).toEqual({
      model: mockElectionModel,
      options: { foreignKey: "election_id" },
    });
  });

  test("should include unique index on election_id", () => {
    const indexes = Timer.options.indexes;
    expect(indexes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          unique: true,
          fields: ["election_id"],
          name: "uq_timer_per_election",
        }),
      ])
    );
  });

  test("should allow mocked CRUD calls", async () => {
    Timer.create = jest.fn().mockResolvedValue({ startDate: new Date() });
    Timer.findAll = jest.fn().mockResolvedValue([{ startDate: new Date() }]);

    const created = await Timer.create({ startDate: new Date() });
    const all = await Timer.findAll();

    expect(created.startDate).toBeInstanceOf(Date);
    expect(all).toHaveLength(1);
    expect(all[0].startDate).toBeInstanceOf(Date);
  });
});
