'use strict';

/** @type {import('sequelize-cli').Migration} */
const argon2 = require("argon2")

module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await argon2.hash(password)

    return queryInterface.bulkInsert('user', [
      {
        userName: 'john_doe',
        email: 'john.doe@example.com',
        passwordHash: password, 
        firstName: 'John',
        lastName: 'Doe',
        userType: 'SuperAdmin', 
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', { email: 'john.doe@example.com' }, {});
  }
};
