'use strict';
const {Model,Sequelize} = require('sequelize');
const sequelize = require('../../../config/database');
 const responseDetail = sequelize.define('responseDetail',{
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'question',
          key : 'id'
        }
      },
      responseId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'response',
          key : 'id'
        }
      },
      responseText: {
        type: Sequelize.STRING
      },
      responseFilePath: {
        type: Sequelize.STRING
      },
      isValid: {
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
      deletedAt: {
        type: Sequelize.DATE
      }
 },{
    paranoid: true,
    freezeTableName : true,
    tableName : "responseDetail"
 })

 module.exports = responseDetail