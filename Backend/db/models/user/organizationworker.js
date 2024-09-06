'use strict';

const sequelize = require("../../../config/database");
const { Model, Sequelize, DataTypes }  = require('sequelize');

const organizationWorker = sequelize.define('organizationWorker',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'user',
      key: 'id',
  },
  allowNull:false
  },
  organizationId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'organization',
      key: 'id',
  },
  allowNull: false
  },
  jobTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  jobDescription: {
    type: Sequelize.STRING,
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
  deletedAt: {
    type: Sequelize.DATE
  }
},{
  paranoid: true,
  freezeTableName: true,
  modelName: 'organizationWorker',
} )


module.exports = organizationWorker