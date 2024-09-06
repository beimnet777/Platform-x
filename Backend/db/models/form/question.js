'use strict';
const {
  Model,Sequelize
} = require('sequelize');
const sequelize = require('../../../config/database');
const responseDetail = require('../response/responsedetail');

const question = sequelize.define('question',{
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
},{
  paranoid: true,
  freezeTableName: true,
  modelName: 'question',
})

question.hasMany(responseDetail,{foreignKey:'questionId'})
responseDetail.belongsTo(question,{foreignKey:'questionId'})

module.exports = question