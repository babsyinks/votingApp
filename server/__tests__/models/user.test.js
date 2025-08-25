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
    static hasMany() {}
    static belongsToMany() {}
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
      BOOLEAN: { key: "BOOLEAN" },
      UUIDV4: "UUIDV4",
    },
  };
});

describe("User Model (unit)", () => {
  let User;
  let mockSequelize;

  beforeAll(() => {
    mockSequelize = {};
    User = require("../../models/user")(mockSequelize, DataTypes);
  });

  const resolveTypeKey = (attr) => {
    if (!attr) return undefined;
    if (attr.type && attr.type.key) return attr.type.key;
    if (attr.key) return attr.key;
    return undefined;
  };

  test("should have correct model name and table name", () => {
    expect(User.options.modelName).toBe("User");
    expect(User.options.tableName).toBe("users");
  });

  test("should define correct attributes", () => {
    const attrs = User.rawAttributes;

    expect(resolveTypeKey(attrs.user_id)).toBe("UUID");
    expect(attrs.user_id.defaultValue).toBe("UUIDV4");
    expect(attrs.user_id.primaryKey).toBe(true);

    expect(resolveTypeKey(attrs.username)).toBe("STRING");
    expect(attrs.username.allowNull).toBe(false);
    expect(attrs.username.unique).toBe(true);

    expect(resolveTypeKey(attrs.password)).toBe("STRING");
    expect(attrs.password.allowNull).toBe(false);

    expect(resolveTypeKey(attrs.email)).toBe("STRING");
    expect(attrs.email.allowNull).toBe(false);
    expect(attrs.email.unique).toBe(true);

    expect(resolveTypeKey(attrs.firstname)).toBe("STRING");
    expect(attrs.firstname.allowNull).toBe(false);

    expect(resolveTypeKey(attrs.lastname)).toBe("STRING");
    expect(attrs.lastname.allowNull).toBe(false);

    expect(resolveTypeKey(attrs.isAdmin)).toBe("BOOLEAN");
    expect(attrs.isAdmin.allowNull).toBe(false);
    expect(attrs.isAdmin.defaultValue).toBe(false);
  });

  test("associate should define belongsToMany relationship to Organization and hasMany to Votes", () => {
    const belongsToManySpy = jest
      .spyOn(User, "belongsToMany")
      .mockImplementation(() => {});
    const hasManySpy = jest.spyOn(User, "hasMany").mockImplementation(() => {});

    const mockModels = { Organization: {}, UserOrganization: {}, Votes: {} };
    User.associate(mockModels);

    expect(belongsToManySpy).toHaveBeenCalledWith(mockModels.Organization, {
      through: mockModels.UserOrganization,
      foreignKey: "user_id",
      otherKey: "organization_id",
    });

    expect(hasManySpy).toHaveBeenCalledWith(mockModels.Votes, {
      foreignKey: "user_id",
    });
  });

  test("toJSON should remove id field", () => {
    const instance = new User();
    instance.get = jest.fn(() => ({
      id: 1,
      user_id: "uuid-123",
      username: "testuser",
    }));
    const json = instance.toJSON();
    expect(json).toEqual({
      user_id: "uuid-123",
      username: "testuser",
    });
    expect(json.id).toBeUndefined();
  });

  test("should have indexes on username and email", () => {
    const indexes = User.options.indexes;
    const fields = indexes.flatMap((i) => i.fields);
    expect(fields).toContain("username");
    expect(fields).toContain("email");
  });

  test("should allow mocked CRUD calls", async () => {
    User.create = jest.fn().mockResolvedValue({ username: "mockuser" });
    User.findAll = jest.fn().mockResolvedValue([{ username: "mockuser" }]);

    const created = await User.create({ username: "mockuser" });
    const all = await User.findAll();

    expect(created.username).toBe("mockuser");
    expect(all).toHaveLength(1);
    expect(all[0].username).toBe("mockuser");
  });
});
