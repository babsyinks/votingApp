"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("timer", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            startDate: {
                type: Sequelize.DATE,
            },
            endDate: {
                type: Sequelize.DATE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("Timers");
    },
};
