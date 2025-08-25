"use strict";

describe("Election Model (unit)", () => {
  let Model;
  let DataTypes;
  let initSpy;
  let Election;
  let electionHooks;

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

    electionHooks = require("../../hooks/electionHooks");

    Election = require("../../models/election")({}, DataTypes);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("calls Model.init once with attributes and options", () => {
    expect(initSpy).toHaveBeenCalledTimes(1);

    const [attrs, options] = initSpy.mock.calls[0];

    expect(attrs).toHaveProperty("election_id");
    expect(attrs.election_id.primaryKey).toBe(true);
    expect(attrs.election_id.type.key).toBe("UUID");

    expect(attrs).toHaveProperty("organization_id");
    expect(attrs.organization_id.allowNull).toBe(false);

    expect(attrs).toHaveProperty("name");
    expect(attrs.name.allowNull).toBe(false);
    expect(attrs.name.type.key).toBe("STRING");

    expect(attrs).toHaveProperty("slug");
    expect(attrs.slug.type.key).toBe("STRING");
    expect(attrs.slug.unique).toBe(true);

    expect(attrs).toHaveProperty("short_link");
    expect(attrs.short_link.type.key).toBe("STRING");

    expect(options).toHaveProperty("modelName", "Election");
    expect(options).toHaveProperty("tableName", "elections");
    expect(options).toHaveProperty("indexes");
    expect(options.indexes).toEqual([{ fields: ["organization_id"] }]);

    expect(options).toHaveProperty("hooks");
    expect(options.hooks.beforeCreate).toBe(electionHooks.beforeCreate);
    expect(options.hooks.afterCreate).toBe(electionHooks.afterCreate);
  });

  test("toJSON should omit id but preserve election_id and other fields", () => {
    const instance = Object.create(Election.prototype);
    instance.get = () => ({
      id: 123,
      election_id: "uuid-123",
      organization_id: "uuid-org",
      name: "Test Election",
      slug: "test-election",
      short_link: "http://sho.rt/abc",
    });

    const json = instance.toJSON();

    expect(json.id).toBeUndefined();
    expect(json.election_id).toBe("uuid-123");
    expect(json.organization_id).toBe("uuid-org");
    expect(json.name).toBe("Test Election");
    expect(json.slug).toBe("test-election");
    expect(json.short_link).toBe("http://sho.rt/abc");
  });

  test("associate sets up correct relationships", () => {
    const belongsToSpy = jest.spyOn(Election, "belongsTo").mockImplementation(() => {});
    const hasManySpy = jest.spyOn(Election, "hasMany").mockImplementation(() => {});
    const hasOneSpy = jest.spyOn(Election, "hasOne").mockImplementation(() => {});

    const models = {
      Organization: {},
      Contestants: {},
      Votes: {},
      Timer: {},
    };

    Election.associate(models);

    expect(belongsToSpy).toHaveBeenCalledWith(models.Organization, { foreignKey: "organization_id" });
    expect(hasManySpy).toHaveBeenCalledWith(models.Contestants, { foreignKey: "election_id" });
    expect(hasManySpy).toHaveBeenCalledWith(models.Votes, { foreignKey: "election_id" });
    expect(hasOneSpy).toHaveBeenCalledWith(models.Timer, { foreignKey: "election_id" });

    belongsToSpy.mockRestore();
    hasManySpy.mockRestore();
    hasOneSpy.mockRestore();
  });
});
