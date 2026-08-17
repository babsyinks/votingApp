"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("votes", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            vote_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            user_id: {
                type: Sequelize.UUID,
            },
            contestant_id: {
                type: Sequelize.UUID,
            },
            position: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("votes");
    },
};
