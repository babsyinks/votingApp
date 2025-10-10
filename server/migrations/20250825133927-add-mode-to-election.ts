"use strict";
import { QueryInterface } from "sequelize";
type SequelizeType = typeof import("sequelize");
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: SequelizeType) {
    await queryInterface.addColumn("elections", "mode", {
      type: Sequelize.ENUM("demo", "live"),
      allowNull: false,
      defaultValue: "demo",
    });

    await queryInterface.addIndex("elections", ["mode"], {
      name: "elections_mode_idx",
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeIndex("elections", "elections_mode_idx");

    await queryInterface.removeColumn("elections", "mode");

    if (queryInterface.sequelize.getDialect() === "postgres") {
      await queryInterface.sequelize.query(
        "DROP TYPE IF EXISTS 'enum_elections_mode';",
      );
    }
  },
};
