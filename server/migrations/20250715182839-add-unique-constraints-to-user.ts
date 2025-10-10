"use strict";
import { QueryInterface } from "sequelize";
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addConstraint("users", {
      fields: ["email"],
      type: "unique",
      name: "unique_users_email",
    });

    await queryInterface.addConstraint("users", {
      fields: ["username"],
      type: "unique",
      name: "unique_users_username",
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeConstraint("users", "unique_users_email");

    await queryInterface.removeConstraint("users", "unique_users_username");
  },
};
