"use strict";
import { QueryInterface } from "sequelize";
module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize"),
  ) {
    await queryInterface.addColumn("users", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "default@email.com", // temp default
    });
    await queryInterface.addColumn("users", "firstname", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Firstname", // temp default
    });
    await queryInterface.addColumn("users", "lastname", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Lastname", // temp default
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("users", "email");
    await queryInterface.removeColumn("users", "firstname");
    await queryInterface.removeColumn("users", "lastname");
  },
};
