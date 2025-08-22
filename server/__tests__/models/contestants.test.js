const { DataTypes, Model } = require("sequelize");

jest.mock("sequelize", () => {
  const actual = jest.requireActual("sequelize");

  class MockModel {
    static init(attributes, options) {
      this.rawAttributes = attributes;
      this.options = options;
      return this;
    }
    static hasMany(model, options) {
      this.hasManyCall = { model, options };
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
      STRING: { key: "STRING" },
      TEXT: { key: "TEXT" },
    },
  };
});

describe("Contestants Model (unit)", () => {
  let Contestants;
  let mockSequelize;

  beforeAll(() => {
    mockSequelize = {};
    Contestants = require("../../models/contestants")(mockSequelize, DataTypes);
  });

  test("should have correct model name and table name", () => {
    expect(Contestants.options.modelName).toBe("Contestants");
    expect(Contestants.options.tableName).toBe("contestants");
  });

  test("should define correct attributes", () => {
    const attrs = Contestants.rawAttributes;

    expect(attrs.contestant_id.type.key).toBe("UUID");
    expect(attrs.contestant_id.defaultValue.key).toBe("UUIDV4");
    expect(attrs.contestant_id.primaryKey).toBe(true);

    expect(attrs.election_id.type.key).toBe("UUID");
    expect(attrs.election_id.allowNull).toBe(false);

    expect(attrs.surname.type.key).toBe("STRING");
    expect(attrs.surname.allowNull).toBe(false);

    expect(attrs.firstname.type.key).toBe("STRING");
    expect(attrs.firstname.allowNull).toBe(false);

    expect(attrs.position.type.key).toBe("STRING");
    expect(attrs.position.allowNull).toBe(false);

    expect(attrs.manifesto.type.key).toBe("TEXT");
    expect(attrs.manifesto.allowNull).toBe(false);

    expect(attrs.picture.type.key).toBe("STRING");
    expect(attrs.picture.allowNull).toBe(false);
  });

  test("toJSON should remove id", () => {
    const instance = new Contestants();
    instance.dataValues = {
      id: 1,
      firstname: "John",
      surname: "Doe",
    };
    const json = instance.toJSON();
    expect(json.id).toBeUndefined();
    expect(json.firstname).toBe("John");
    expect(json.surname).toBe("Doe");
  });

  test("associate should define relationships", () => {
    const mockVotesModel = {};
    const mockElectionModel = {};

    Contestants.associate({ Votes: mockVotesModel, Election: mockElectionModel });

    expect(Contestants.hasManyCall).toEqual({
      model: mockVotesModel,
      options: { foreignKey: "contestant_id" },
    });

    expect(Contestants.belongsToCall).toEqual({
      model: mockElectionModel,
      options: { foreignKey: "election_id" },
    });
  });

  test("should include indexes on election_id and position", () => {
    const indexes = Contestants.options.indexes;
    expect(indexes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fields: ["election_id"] }),
        expect.objectContaining({ fields: ["position"] }),
      ])
    );
  });

  test("should allow mocked CRUD calls", async () => {
    Contestants.create = jest.fn().mockResolvedValue({ firstname: "John" });
    Contestants.findAll = jest.fn().mockResolvedValue([{ firstname: "John" }]);

    const created = await Contestants.create({ firstname: "John" });
    const all = await Contestants.findAll();

    expect(created.firstname).toBe("John");
    expect(all).toHaveLength(1);
    expect(all[0].firstname).toBe("John");
  });
});
