"use strict";
import { QueryInterface } from "sequelize";
module.exports = {
  up: async (
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize"),
  ) => {
    await queryInterface.createTable("signup_tokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      codeHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("signup_tokens");
  },
};
