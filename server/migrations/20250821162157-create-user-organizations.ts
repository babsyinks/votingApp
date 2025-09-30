"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_organizations", {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "organizations",
          key: "organization_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      role: {
        type: Sequelize.ENUM("user", "election-manager"),
        allowNull: false,
        defaultValue: "user",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // unique index to prevent duplicate memberships
    await queryInterface.addConstraint("user_organizations", {
      fields: ["user_id", "organization_id"],
      type: "unique",
      name: "uq_user_org_membership",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_organizations");
  },
};
