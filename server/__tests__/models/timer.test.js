const { DataTypes } = require("sequelize");

jest.mock("sequelize", () => {
  const actual = jest.requireActual("sequelize");

  class MockModel {
    static init(attributes, options) {
      this.rawAttributes = attributes;
      this.options = options;
      return this;
    }
    static associate() {}
    get() {
      return this.dataValues || {};
    }
  }

  return {
    ...actual,
    Model: MockModel,
    DataTypes: {
      ...actual.DataTypes,
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
    expect(Timer.options.tableName).toBe("timer");
  });

  test("should define correct attributes", () => {
    const attrs = Timer.rawAttributes;

    const resolveTypeKey = (attr) => {
      if (!attr) return undefined;
      if (attr.type && attr.type.key) return attr.type.key;
      if (attr.key) return attr.key;
      if (attr.constructor && attr.constructor.name) return attr.constructor.name;
      return undefined;
    };

    expect(resolveTypeKey(attrs.startDate)).toBe("DATE");
    expect(resolveTypeKey(attrs.endDate)).toBe("DATE");
  });

  test("associate should not throw", () => {
    expect(() => Timer.associate({})).not.toThrow();
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
