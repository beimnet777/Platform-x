'use strict';
const {Model,Sequelize} = require('sequelize');
const sequelize = require('../../../config/database');
const question = require('./question');
const response = require('../response/response');

const form = sequelize.define('form',{
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
    }
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
  estimatedTime :{
    type: Sequelize.INTEGER,
    allowNull : false
  },
  tags :{
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull : false
  },
  reward :{
    type: Sequelize.INTEGER,
    allowNull : false
  },
  numberOfQuestion: {
    type: Sequelize.INTEGER,
    allowNull:false
  },
  totalResponse: {
    type: Sequelize.INTEGER,
    allowNull:false,
    validate : {
      min : 1
    }
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
},{
  paranoid: true,
  freezeTableName: true,
  modelName: 'form',
} )

form.hasMany(question,{foreignKey:'formId'})
question.belongsTo(form,{foreignKey: 'formId'})

form.hasMany(response,{foreignKey:'formId'})
response.belongsTo(form,{foreignKey: 'formId'})

module.exports = form