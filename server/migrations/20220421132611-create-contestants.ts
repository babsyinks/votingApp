"use strict";

import { QueryInterface } from "sequelize";

module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize"),
  ) {
    await queryInterface.createTable("contestants", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contestant_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      surname: Sequelize.STRING,
      firstname: Sequelize.STRING,
      position: Sequelize.STRING,
      manifesto: Sequelize.TEXT,
      picture: Sequelize.STRING,
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
    await queryInterface.dropTable("contestants");
  },
};
