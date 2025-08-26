"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Organization, {
        through: models.UserOrganization,
        foreignKey: "user_id",
        otherKey: "organization_id",
      });
      User.hasMany(models.Votes, { foreignKey: "user_id" });
    }

    toJSON() {
      const attributes = { ...this.get() };
      delete attributes.password; // exclude sensitive field
      attributes.role = attributes.isAdmin ? "admin" : "user";
      return attributes;
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      indexes: [{ fields: ["username"] }, { fields: ["email"] }],
    },
  );

  return User;
};
