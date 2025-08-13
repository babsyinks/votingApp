"use strict";

describe("Code Model (unit)", () => {
  let Model;
  let DataTypes;
  let initSpy;
  let Code;

  beforeEach(() => {
    jest.resetModules();

    const sequelize = require("sequelize");
    Model = sequelize.Model;
    DataTypes = sequelize.DataTypes;

    // Spy on Model.init and replace implementation so it doesn't run Sequelize internals.
    // The implementation should attach rawAttributes and options to the class
    initSpy = jest.spyOn(Model, "init").mockImplementation(function (attributes, options) {
      this.rawAttributes = attributes;
      this.options = options;
      return this;
    });

    Code = require("../../models/code")({}, DataTypes);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("calls Model.init once with attributes and options", () => {
    expect(initSpy).toHaveBeenCalledTimes(1);

    const [attrs, options] = initSpy.mock.calls[0];

    expect(attrs).toHaveProperty("codeHash");
    expect(attrs).toHaveProperty("email");
    expect(attrs).toHaveProperty("type");
    expect(attrs).toHaveProperty("expiresAt");

    expect(options).toHaveProperty("modelName", "Code");
    expect(options).toHaveProperty("tableName", "codes");
  });

  test("enum values include signup, password_reset, email_change", () => {
    const typeAttr = Code.rawAttributes.type;
    expect(typeAttr).toBeDefined();
    expect(typeAttr.type).toBeDefined();

    const enumValues = typeAttr.type.options?.values || typeAttr.type.values;

    expect(enumValues).toEqual(["signup", "password_reset", "email_change"]);
  });

  test("toJSON should omit id and preserve other fields", () => {

    const instance = Object.create(Code.prototype);
    const now = new Date();
    instance.get = () => ({
      id: 123,
      codeHash: "hashed-value",
      email: "test@example.com",
      type: "signup",
      expiresAt: now,
    });

    const json = instance.toJSON();

    expect(json.id).toBeUndefined();
    expect(json.codeHash).toBe("hashed-value");
    expect(json.email).toBe("test@example.com");
    expect(json.type).toBe("signup");
    expect(json.expiresAt).toBe(now);
  });

  test("associate exists and is callable", () => {
    expect(typeof Code.associate).toBe("function");
    expect(() => Code.associate({})).not.toThrow();
  });
});
