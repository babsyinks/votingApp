"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
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

  async down(queryInterface, Sequelize) {
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
