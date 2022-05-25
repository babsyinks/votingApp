'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vote_id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      contestant_id: {
        type: Sequelize.INTEGER
      },
      position: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('votes');
  }
};