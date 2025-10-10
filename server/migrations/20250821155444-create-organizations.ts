"use strict";
import { QueryInterface } from "sequelize";

module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize"),
  ) {
    await queryInterface.createTable("organizations", {
      organization_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("organizations");
  },
};
