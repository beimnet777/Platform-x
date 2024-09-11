const sequelize = require('../config/database');
const OrganizationWorker = require('../db/models/user/organizationworker');
const Organization = require('../db/models/user/organization');
const catchAsyncError = require('../utils/catchAsyncError');
const argon2 = require("argon2")
const user = require('../db/models/user/user');
const form = require('../db/models/form/form');
const organization = require('../db/models/user/organization');
const response = require('../db/models/response/response');
const responseDetail = require('../db/models/response/responsedetail');
const { Op, where } = require('sequelize');
const question = require('../db/models/form/question');
const organizationWorker = require('../db/models/user/organizationworker');


const createOrgMember  = catchAsyncError( async (req, res) => {
 
    const { email, password, firstName, lastName, userType, jobTitle, jobDescription } = req.body;

    // Validate required fields
    if ( !jobTitle || !jobDescription) {
      return res.status(400).json({ error: 'All fields are required.' })
    }
    const passwordHash = await argon2.hash(password)
    const t = await sequelize.transaction();
    const newUser = await user.create({
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



    

  const getFormsByOrganization = catchAsyncError (async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // default pagination values
    const offset = (page - 1) * limit;
  
    const organizationObject = await organization.findOne({where: { createdBy: req.user.id }})
    const organizationId = organizationObject.dataValues.id

      const forms = await form.findAndCountAll({
        where: { organizationId: organizationId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
  
      const totalPages = Math.ceil(forms.count / limit);
  
      // Generate next and previous page URLs
      const nextPage =
        page < totalPages
          ? `${req.protocol}://${req.get('host')}${req.path}?page=${parseInt(page) + 1}&limit=${limit}`
          : null;
  
      const prevPage =
        page > 1
          ? `${req.protocol}://${req.get('host')}${req.path}?page=${parseInt(page) - 1}&limit=${limit}`
          : null;
  
      return res.json({
        totalForms: forms.count,
        totalPages,
        currentPage: parseInt(page),
        forms: forms.rows,
        nextPage,
        prevPage,
      });
    
  });


  const getResponsesByForm = catchAsyncError (async (req, res) => {
    const { formId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
  
    
      const responses = await response.findAndCountAll({
        where: { formId: formId },
        include: [{ model: responseDetail }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
  
      const totalPages = Math.ceil(responses.count / limit);
  
      // Generate next and previous page URLs
      const nextPage =
        page < totalPages
          ? `${req.protocol}://${req.get('host')}${req.path}?page=${parseInt(page) + 1}&limit=${limit}`
          : null;
  
      const prevPage =
        page > 1
          ? `${req.protocol}://${req.get('host')}${req.path}?page=${parseInt(page) - 1}&limit=${limit}`
          : null;
  
      return res.json({
        totalResponses: responses.count,
        totalPages,
        currentPage: parseInt(page),
        responses: responses.rows,
        nextPage,
        prevPage,
      });
    
  });


  const getResponseStatsByForm = catchAsyncError(async (req, res) => {
    const { formId } = req.params;
    const { startDate, endDate } = req.query;
  
      const responseCount = await response.count({
        where: {
          formId: formId,
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
      });
  
      return res.json({ responseCount });
    
  });


  const getResponseStatsByOrganization = catchAsyncError(async (req, res) => {
    const { startDate, endDate } = req.query;


    const organizationObject = await organization.findOne({where: { createdBy: req.user.id }})
    const organizationId = organizationObject.dataValues.id
  
      const responseCount = await response.count({
        where: {
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
        include: [{
          model: form,
          where: { organizationId: organizationId },
        }],
      });
  
      return res.json({ responseCount });
  });
  

  const validateResponse  = catchAsyncError(
    async (req,res,next) =>{
      const responseId  = req.params.responseId

      const fetchedResponse  = await response.findOne( {where : { id: responseId}})

      if (!fetchedResponse){
        res.status(404).json(" response can't be found ")
      }
      fetchedResponse.isValid = true
      fetchedResponse.save()

      res.json({
        status : "success",
        message : "response validated successfuly"
      })


    }
  )

  const getFormQuestions = catchAsyncError (
    async (req,res,next) =>{
      const formId = req.params.formId

      const questions  = await question.findAll({where : {formId}})

      if (questions.length === 0){
        return res.status(404).json( " couldn't find questions associated with this form" )
      }

      res.json(questions)
    }
  )

  const getOrgMember = catchAsyncError (
    async (req,res,next) =>{
      const userId = req.user.id
      const organizationObject = await organization.findOne({where : { createdBy: userId}})

      if (!organizationObject) {
        res.status(404).json( "organization can not be found" )
      }
      const orgMembers = await organizationWorker.findAll (
        {where : 
          { organizationId: organizationObject.id

          },
          include: [{
            model: user,    
            attributes: ['id', 'email', 'firstName', 'lastName']
          }]
        })

      if (orgMembers.length === 0){
        return res.status(404).json( " couldn't find questions associated with this form" )
      }

      res.json(orgMembers)
    }
  )
  
  
    

module.exports = { createOrgMember, getFormsByOrganization, getResponsesByForm, getResponseStatsByForm, getResponseStatsByOrganization, validateResponse, getFormQuestions, getOrgMember}
