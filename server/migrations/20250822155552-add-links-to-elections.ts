"use strict";
import { QueryInterface } from "sequelize";
type SequelizeType = typeof import("sequelize");
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: SequelizeType) {
    await queryInterface.addColumn("elections", "slug", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn("elections", "short_link", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
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

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeIndex("elections", "elections_slug_idx");
    await queryInterface.removeIndex("elections", "elections_short_link_idx");

    await queryInterface.removeColumn("elections", "slug");
    await queryInterface.removeColumn("elections", "short_link");
  },
};
