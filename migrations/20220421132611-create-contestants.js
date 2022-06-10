'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contestants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contestant_id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4
      },
      surname: {
        type: Sequelize.STRING
      },
      firstname: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      manifesto: {
        type: Sequelize.TEXT
      },
      picture: {
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
    await queryInterface.dropTable('contestants');
  }
};