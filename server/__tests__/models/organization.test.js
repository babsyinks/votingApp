"use strict";

describe("Organization Model (unit)", () => {
  let Model;
  let DataTypes;
  let initSpy;
  let Organization;

  beforeEach(() => {
    jest.resetModules();

    const sequelize = require("sequelize");
    Model = sequelize.Model;
    DataTypes = sequelize.DataTypes;

    initSpy = jest.spyOn(Model, "init").mockImplementation(function (attributes, options) {
      this.rawAttributes = attributes;
      this.options = options;
      return this;
    });

    Organization = require("../../models/organization")({}, DataTypes);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("calls Model.init once with attributes and options", () => {
    expect(initSpy).toHaveBeenCalledTimes(1);

    const [attrs, options] = initSpy.mock.calls[0];

    expect(attrs).toHaveProperty("organization_id");
    expect(attrs.organization_id.primaryKey).toBe(true);
    expect(attrs.organization_id.type.key).toBe("UUID");

    expect(attrs).toHaveProperty("name");
    expect(attrs.name.allowNull).toBe(false);
    expect(attrs.name.unique).toBe(true);
    expect(attrs.name.type.key).toBe("STRING");

    expect(attrs).toHaveProperty("description");
    expect(attrs.description.type.key).toBe("TEXT");

    expect(options).toHaveProperty("modelName", "Organization");
    expect(options).toHaveProperty("tableName", "organizations");
  });

  test("toJSON should omit id but preserve organization_id and other fields", () => {
    const instance = Object.create(Organization.prototype);
    instance.get = () => ({
      id: 123,
      organization_id: "uuid-org",
      name: "My Org",
      description: "Test description",
    });

    const json = instance.toJSON();

    expect(json.id).toBeUndefined();
    expect(json.organization_id).toBe("uuid-org");
    expect(json.name).toBe("My Org");
    expect(json.description).toBe("Test description");
  });

  test("associate sets up correct relationships", () => {
    const hasManySpy = jest.spyOn(Organization, "hasMany").mockImplementation(() => {});
    const belongsToManySpy = jest.spyOn(Organization, "belongsToMany").mockImplementation(() => {});

    const models = {
      Election: {},
      User: {},
      UserOrganization: {},
    };

    Organization.associate(models);

    expect(hasManySpy).toHaveBeenCalledWith(models.Election, { foreignKey: "organization_id" });
    expect(belongsToManySpy).toHaveBeenCalledWith(models.User, {
      through: models.UserOrganization,
      foreignKey: "organization_id",
      otherKey: "user_id",
    });

    hasManySpy.mockRestore();
    belongsToManySpy.mockRestore();
  });
});
