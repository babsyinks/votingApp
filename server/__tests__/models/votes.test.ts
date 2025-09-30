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
    static belongsTo() {}
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
      STRING: { key: "STRING" },
      UUIDV4: "UUIDV4",
    },
  };
});

describe("Votes Model (unit)", () => {
  let Votes;
  let mockSequelize;

  beforeAll(() => {
    mockSequelize = {};
    Votes = require("../../models/votes")(mockSequelize, DataTypes);
  });

  const resolveTypeKey = (attr) => {
    if (!attr) return undefined;
    if (attr.type && attr.type.key) return attr.type.key;
    if (attr.key) return attr.key;
    return undefined;
  };

  test("should have correct model name and table name", () => {
    expect(Votes.options.modelName).toBe("Votes");
    expect(Votes.options.tableName).toBe("votes");
  });

  test("should define correct attributes", () => {
    const attrs = Votes.rawAttributes;

    expect(resolveTypeKey(attrs.vote_id)).toBe("UUID");
    expect(attrs.vote_id.defaultValue).toBe("UUIDV4");
    expect(attrs.vote_id.primaryKey).toBe(true);

    expect(resolveTypeKey(attrs.election_id)).toBe("UUID");
    expect(attrs.election_id.allowNull).toBe(false);

    expect(resolveTypeKey(attrs.user_id)).toBe("UUID");
    expect(attrs.user_id.allowNull).toBe(false);

    expect(resolveTypeKey(attrs.contestant_id)).toBe("UUID");
    expect(attrs.contestant_id.allowNull).toBe(false);

    expect(resolveTypeKey(attrs.position)).toBe("STRING");
    expect(attrs.position.allowNull).toBe(false);
  });

  test("associate should define belongsTo relationships", () => {
    const belongsToSpy = jest.spyOn(Votes, "belongsTo").mockImplementation(() => {});
    const mockModels = { User: {}, Contestants: {}, Election: {} };

    Votes.associate(mockModels);

    expect(belongsToSpy).toHaveBeenCalledWith(mockModels.User, { foreignKey: "user_id" });
    expect(belongsToSpy).toHaveBeenCalledWith(mockModels.Contestants, { foreignKey: "contestant_id" });
    expect(belongsToSpy).toHaveBeenCalledWith(mockModels.Election, { foreignKey: "election_id" });
  });

  test("should define indexes including unique composite index", () => {
    const indexes = Votes.options.indexes;

    expect(indexes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fields: ["election_id"] }),
        expect.objectContaining({ fields: ["user_id"] }),
        expect.objectContaining({ fields: ["contestant_id"] }),
        expect.objectContaining({
          unique: true,
          fields: ["election_id", "user_id", "position"],
          name: "uq_vote_once_per_position_per_election",
        }),
      ])
    );
  });

  test("toJSON should return model json form", () => {
    const instance = new Votes();
    instance.get = jest.fn(() => ({
      vote_id: "uuid-123",
      user_id: "uuid-456",
      election_id: "uuid-789",
    }));
    const json = instance.toJSON();

    expect(json).toEqual({
      vote_id: "uuid-123",
      user_id: "uuid-456",
      election_id: "uuid-789",
    });
  });

  test("should allow mocked CRUD calls", async () => {
    Votes.create = jest.fn().mockResolvedValue({ position: "President" });
    Votes.findAll = jest.fn().mockResolvedValue([{ position: "President" }]);

    const created = await Votes.create({ position: "President" });
    const all = await Votes.findAll();

    expect(created.position).toBe("President");
    expect(all).toHaveLength(1);
    expect(all[0].position).toBe("President");
  });
});
