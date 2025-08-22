"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("votes", "id");

    await queryInterface.changeColumn("votes", "vote_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });

    await queryInterface.addConstraint("votes", {
      fields: ["vote_id"],
      type: "primary key",
      name: "votes_pkey",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("votes", "votes_pkey");

    await queryInterface.addColumn("votes", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
  },
};
