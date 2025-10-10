"use strict";
import { QueryInterface } from "sequelize";
module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize"),
  ) {
    await queryInterface.createTable("timer", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("Timers");
  },
};
