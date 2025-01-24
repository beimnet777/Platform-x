'use strict';
const {Model, Sequelize} = require('sequelize');
const sequelize = require('../../../config/database');
const responseDetail = require('./responsedetail');

const response = sequelize.define('response',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  agentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references : {
      model: 'agent',
      key : 'id'
    }
  },
  formId: {
    type: Sequelize.INTEGER,
    allowNull : false,
    references : {
      model : 'form',
      key : "id"
    }
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
  deletedAt : {
    type: Sequelize.DATE
  }
},{
  paranoid: true,
  freezeTableName: true,
  modelName: 'question',
})

response.hasMany(responseDetail,{foreignKey:'responseId'})
responseDetail.belongsTo(response,{foreignKey:'responseId'})


module.exports = response