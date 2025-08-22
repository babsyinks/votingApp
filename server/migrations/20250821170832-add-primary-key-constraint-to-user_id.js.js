"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeColumn("users", "id");

    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });

    await queryInterface.addConstraint("users", {
      fields: ["user_id"],
      type: "primary key",
      name: "users_pkey",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("users", "users_pkey");

    await queryInterface.addColumn("users", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });

    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
  },
};
