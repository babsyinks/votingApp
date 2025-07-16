"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Code extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {}

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  Code.init(
    {
      codeHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("signup", "password_reset", "email_change"),
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Code",
      tableName: "codes",
    },
  );

  return Code;
};
