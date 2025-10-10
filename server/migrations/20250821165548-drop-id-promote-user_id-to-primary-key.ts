"use strict";
import { QueryInterface } from "sequelize";
type SequelizeType = typeof import("sequelize");
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: SequelizeType) {
    await queryInterface.removeColumn("users", "id");

    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUID,
      primaryKey: true,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: SequelizeType) {
    await queryInterface.addColumn("users", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });

    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUID,
    });
  },
};
