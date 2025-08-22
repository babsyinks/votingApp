"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn("users", "isAdmin", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.sequelize.query(`
      UPDATE users
      SET "isAdmin" = CASE
        WHEN role = 'admin' THEN true
        ELSE false
      END
    `);

    await queryInterface.removeColumn("users", "role");

    await queryInterface.addIndex("users", ["username"], {
      unique: true,
      name: "users_username_unique",
    });

    await queryInterface.addIndex("users", ["email"], {
      unique: true,
      name: "users_email_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("users", "users_username_unique");
    await queryInterface.removeIndex("users", "users_email_unique");

    await queryInterface.addColumn("users", "role", {
      type: Sequelize.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    });

    await queryInterface.sequelize.query(`
      UPDATE users
      SET role = CASE
        WHEN "isAdmin" = true THEN 'admin'
        ELSE 'user'
      END
    `);

    await queryInterface.removeColumn("users", "isAdmin");
  },
};
