"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "id");

    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUID,
      primaryKey: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });

    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUID,
    });
  },
};
