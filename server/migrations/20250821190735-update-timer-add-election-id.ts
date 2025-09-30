"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn("timers", "election_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    });

    await queryInterface.addConstraint("timers", {
      fields: ["election_id"],
      type: "foreign key",
      name: "fk_timer_election",
      references: {
        table: "elections",
        field: "election_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("timers", ["election_id"], {
      unique: true,
      name: "uq_timer_per_election",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("timers", "uq_timer_per_election");
    await queryInterface.removeConstraint("timers", "fk_timer_election");
    await queryInterface.removeColumn("timers", "election_id");
    await queryInterface.removeColumn("timers", "timer_id");

    await queryInterface.addColumn("timers", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
  },
};
