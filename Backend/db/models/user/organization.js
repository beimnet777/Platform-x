'use strict';
const sequelize = require("../../../config/database");
const { Model, Sequelize, DataTypes }  = require('sequelize');
const user = require("./user");
const organizationWorker = require("./organizationworker");
const form = require("../form/form");

const organization = sequelize.define('organization',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  organizationName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  organizationDescription: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
  },
  },
  approved: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
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
    type : Sequelize.DATE
  }
},{
  paranoid: true,
  freezeTableName: true,
  modelName: 'organization',
} )

organization.hasMany(organizationWorker, {foreignKey:"organizationId"})
organizationWorker.belongsTo(organization,{foreignKey:"organizationId"})

organization.hasMany(form,{foreignKey:"organizationId"})
form.belongsTo(organization,{foreignKey:"organizationId"})

module.exports = organization