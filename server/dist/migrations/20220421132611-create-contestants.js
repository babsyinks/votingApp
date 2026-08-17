"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("contestants", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            contestant_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            surname: Sequelize.STRING,
            firstname: Sequelize.STRING,
            position: Sequelize.STRING,
            manifesto: Sequelize.TEXT,
            picture: Sequelize.STRING,
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
        await queryInterface.dropTable("contestants");
    },
};
