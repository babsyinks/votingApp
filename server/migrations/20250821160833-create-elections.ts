"use strict";
import { QueryInterface } from "sequelize";

module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize"),
  ) {
    await queryInterface.createTable("elections", {
      election_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "organizations",
          key: "organization_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("elections", ["organization_id"]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("elections");
  },
};
