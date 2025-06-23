"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SignupToken extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {}

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  SignupToken.init(
    {
      codeHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SignupToken",
      tableName: "signup_tokens",
    },
  );

  return SignupToken;
};
