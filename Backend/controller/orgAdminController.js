const sequelize = require('../config/database');
const OrganizationWorker = require('../db/models/user/organizationworker');
const Organization = require('../db/models/user/organization');
const catchAsyncError = require('../utils/catchAsyncError');
const argon2 = require("argon2")
const user = require('../db/models/user/user');
const { response } = require('express');


const createOrgMember  = catchAsyncError( async (req, res) => {
 
    const { userName, email, password, firstName, lastName, userType, jobTitle, jobDescription } = req.body;

    // Validate required fields
    if ( !jobTitle || !jobDescription) {
      return res.status(400).json({ error: 'All fields are required.' })
    }
    const passwordHash = await argon2.hash(password)
    const t = await sequelize.transaction();
    const newUser = await user.create({
        userName,
        email,
        passwordHash,
        firstName,
        lastName,
        userType
      },{ transaction :t })
      let userId =newUser.id
      const organizationObject = await Organization.findOne({where: { createdBy: req.user.id }});
      const organizationId = organizationObject.dataValues.id

      
    // Create the new organization worker
    const organizationWorker = await OrganizationWorker.create({
      userId,
      organizationId,
      jobTitle,
      jobDescription
    }, {transaction: t});

    
    let response  = {}
    response.userInfo = newUser
    response.orgMemberInfo = organizationWorker

    await t.commit()

    return res.status(201).json(response) })

module.exports = createOrgMember
