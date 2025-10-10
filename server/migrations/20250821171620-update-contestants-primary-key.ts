"use strict";
import { QueryInterface } from "sequelize";
type SequelizeType = typeof import("sequelize");
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: SequelizeType) {
    await queryInterface.removeColumn("contestants", "id");

    await queryInterface.changeColumn("contestants", "contestant_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });

    await queryInterface.addConstraint("contestants", {
      fields: ["contestant_id"],
      type: "primary key",
      name: "contestants_pkey",
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: SequelizeType) {
    await queryInterface.removeConstraint("contestants", "contestants_pkey");

    await queryInterface.addColumn("contestants", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
  },
};
