"use strict";

describe("UserOrganization Model (unit)", () => {
  let Model;
  let DataTypes;
  let initSpy;
  let UserOrganization;

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

    UserOrganization = require("../../models/userOrganization")({}, DataTypes);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("calls Model.init once with attributes and options", () => {
    expect(initSpy).toHaveBeenCalledTimes(1);

    const [attrs, options] = initSpy.mock.calls[0];

    expect(attrs).toHaveProperty("user_id");
    expect(attrs.user_id.allowNull).toBe(false);
    expect(attrs.user_id.type.key).toBe("UUID");

    expect(attrs).toHaveProperty("organization_id");
    expect(attrs.organization_id.allowNull).toBe(false);
    expect(attrs.organization_id.type.key).toBe("UUID");

    expect(attrs).toHaveProperty("role");
    expect(attrs.role.allowNull).toBe(false);
    expect(attrs.role.defaultValue).toBe("user");
    expect(attrs.role.type.values).toEqual(["user", "election-manager"]);

    expect(options).toHaveProperty("modelName", "UserOrganization");
    expect(options).toHaveProperty("tableName", "user_organizations");

    expect(options.indexes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          unique: true,
          fields: ["user_id", "organization_id"],
          name: "uq_user_org_membership",
        }),
      ]),
    );
  });

  test("toJSON should return model json form", () => {
    const instance = Object.create(UserOrganization.prototype);
    instance.get = () => ({
      user_id: "uuid-user",
      organization_id: "uuid-org",
      role: "election-manager",
    });

    const json = instance.toJSON();

    expect(json.user_id).toBe("uuid-user");
    expect(json.organization_id).toBe("uuid-org");
    expect(json.role).toBe("election-manager");
  });

  test("associate does not throw and can be called safely", () => {
    expect(() => {
      UserOrganization.associate({});
    }).not.toThrow();
  });
});
