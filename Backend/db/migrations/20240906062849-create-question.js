'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      formId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
            model: 'form',  
            key: 'id',              
        }
      },
      questionTitle: {
        type: Sequelize.STRING,
        allowNull:false
      },
      questionDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      questionType: {
        type: Sequelize.ENUM("Audio","ShortAnswer"),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('question');
  }
};