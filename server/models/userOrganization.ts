"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserOrganization extends Model {
    static associate(models) {}
    toJSON() {
      return this.get();
    }
  }

  UserOrganization.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      organization_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        // per-organization roles only
        type: DataTypes.ENUM("user", "election-manager"),
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "UserOrganization",
      tableName: "user_organizations",
      indexes: [
        {
          unique: true,
          fields: ["user_id", "organization_id"],
          name: "uq_user_org_membership",
        },
      ],
    },
  );

  return UserOrganization;
};
