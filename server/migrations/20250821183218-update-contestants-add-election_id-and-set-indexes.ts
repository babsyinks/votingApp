"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
/*     await queryInterface.addColumn("contestants", "election_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "elections",
        key: "election_id",
      },
      onDelete: "CASCADE",
    }); */

    await queryInterface.changeColumn("contestants", "election_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "elections",
        key: "election_id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addIndex("contestants", ["election_id"], {
      name: "idx_contestants_election_id",
    });
    await queryInterface.addIndex("contestants", ["position"], {
      name: "idx_contestants_position",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("contestants", "idx_contestants_election_id");
    await queryInterface.removeIndex("contestants", "idx_contestants_position");
    await queryInterface.removeColumn("contestants", "election_id");
  },
};
