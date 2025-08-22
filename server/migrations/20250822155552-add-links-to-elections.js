"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("elections", "slug", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: "name",
    });

    await queryInterface.addColumn("elections", "short_link", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      after: "slug",
    });

    await queryInterface.addIndex("elections", ["slug"], {
      unique: true,
      name: "elections_slug_idx",
    });

    await queryInterface.addIndex("elections", ["short_link"], {
      unique: true,
      name: "elections_short_link_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("elections", "elections_slug_idx");
    await queryInterface.removeIndex("elections", "elections_short_link_idx");

    await queryInterface.removeColumn("elections", "slug");
    await queryInterface.removeColumn("elections", "short_link");
  },
};
