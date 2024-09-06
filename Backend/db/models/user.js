'use strict';
const sequelize = require('../../config/database')
const { Model, Sequelize, DataTypes }  = require('sequelize');
const agent = require('./agent');
const organization = require('./organization');
const organizationWorker = require('./organizationworker');

const user = sequelize.define('user',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  userName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate:{
      isEmail:true
    }
  },
  passwordHash: {
    type: Sequelize.STRING
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userType:{
    allowNull:false,
    type: Sequelize.ENUM("Agent","OrgAdmin","SuperAdmin","OrgMember")
  },
  lastLogin:{
    type: Sequelize.DATE
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
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'user',
})

user.hasOne(agent,{foreignKey:'userId'})
agent.belongsTo(user, {foreignKey:"userId"})
user.hasOne(organization,{foreignKey:'createdBy'})
organization.belongsTo(user, {foreignKey:"createdBy"})
user.hasOne(organizationWorker,{foreignKey:'userId'})
organizationWorker.belongsTo(user,{foreignKey:"userId"})

module.exports = user