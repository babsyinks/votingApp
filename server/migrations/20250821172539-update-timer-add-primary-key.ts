"use strict";
import { QueryInterface } from "sequelize";
type SequelizeType = typeof import("sequelize");
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: SequelizeType) {
    // await queryInterface.removeColumn("timers", "id");

    await queryInterface.addColumn("timers", "timer_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });

    await queryInterface.addConstraint("timers", {
      fields: ["timer_id"],
      type: "primary key",
      name: "timer_pkey",
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: SequelizeType) {
    await queryInterface.removeConstraint("timers", "timer_pkey");

    await queryInterface.removeColumn("timers", "timer_id");

    await queryInterface.addColumn("timers", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
  },
};
