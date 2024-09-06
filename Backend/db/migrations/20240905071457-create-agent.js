'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agent', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',  
          key: 'id',              
        },
      },
      gender: {
        type: Sequelize.ENUM(["Male","Female"]),
        allowNull: false
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull:false,
        validate:{
          min:18,
          max:80
        }
      },
      totalMoneyEarned: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      cashedOut: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      currentBalance: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      approved:{
        type: Sequelize.BOOLEAN,
        defaultValue : false 
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
    await queryInterface.dropTable('agent');
  }
};