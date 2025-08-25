"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      Organization.hasMany(models.Election, { foreignKey: "organization_id" });
      Organization.belongsToMany(models.User, {
        through: models.UserOrganization,
        foreignKey: "organization_id",
        otherKey: "user_id",
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  Organization.init(
    {
      organization_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "Organization",
      tableName: "organizations",
    },
  );

  return Organization;
};
