"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("codes", "code_id", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: Sequelize.UUIDV4,
    });

    const [rows] = await queryInterface.sequelize.query(`SELECT * FROM codes`);
    for (const row of rows) {
      await queryInterface.sequelize.query(
        `UPDATE codes SET code_id = :uuid WHERE id = :id`,
        { replacements: { uuid: uuidv4(), id: row.id } }
      );
    }

    await queryInterface.changeColumn("codes", "code_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });

    await queryInterface.removeColumn("codes", "id");

    await queryInterface.addConstraint("codes", {
      fields: ["code_id"],
      type: "primary key",
      name: "code_pkey",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("codes", "code_pkey");

    await queryInterface.removeColumn("codes", "code_id");

    await queryInterface.addColumn("codes", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
  },
};
