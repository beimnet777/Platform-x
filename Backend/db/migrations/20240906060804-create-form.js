'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('form', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'organization',  
          key: 'id',              
        },
      },
      formName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      formDescription: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isOpen: {
        type: Sequelize.BOOLEAN,
        defaultValue :true
      },
      numberOfQuestion: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      totalResponse: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      currentResponse: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      minAgentAge: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      maxAgentAge: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      agentGender: {
        type: Sequelize.ARRAY(Sequelize.ENUM('Male', 'Female')),
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt :{
        type : Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('form');
  }
};