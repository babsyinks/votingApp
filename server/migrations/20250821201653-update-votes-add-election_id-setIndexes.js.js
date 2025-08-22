"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn("votes", "election_id", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.addIndex("votes", ["election_id"], {
      name: "votes_election_id_idx",
    });
    await queryInterface.addIndex("votes", ["user_id"], {
      name: "votes_user_id_idx",
    });
    await queryInterface.addIndex("votes", ["contestant_id"], {
      name: "votes_contestant_id_idx",
    });

    // Add composite unique constraint (election_id + user_id + position)
    await queryInterface.addConstraint("votes", {
      fields: ["election_id", "user_id", "position"],
      type: "unique",
      name: "uq_vote_once_per_position_per_election",
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeConstraint(
      "votes",
      "uq_vote_once_per_position_per_election"
    );

    await queryInterface.removeIndex("votes", "votes_election_id_idx");
    await queryInterface.removeIndex("votes", "votes_user_id_idx");
    await queryInterface.removeIndex("votes", "votes_contestant_id_idx");

    await queryInterface.removeColumn("votes", "election_id");

    await queryInterface.changeColumn("votes", "vote_id", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    });

    await queryInterface.addColumn("votes", "id", {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    });
  },
};
