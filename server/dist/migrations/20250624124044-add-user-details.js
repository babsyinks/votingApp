"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("users", "email", {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "default@email.com", // temp default
        });
        await queryInterface.addColumn("users", "firstname", {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "Firstname", // temp default
        });
        await queryInterface.addColumn("users", "lastname", {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "Lastname", // temp default
        });
    },
    async down(queryInterface) {
        await queryInterface.removeColumn("users", "email");
        await queryInterface.removeColumn("users", "firstname");
        await queryInterface.removeColumn("users", "lastname");
    },
};
