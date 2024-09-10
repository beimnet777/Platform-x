const organization = require("../db/models/user/organization");
const user = require("../db/models/user/user");

const sequelize  = require ('../config/database')

const argon2 = require("argon2")
const catchAsyncError = require("../utils/catchAsyncError");
const agent = require("../db/models/user/agent");

// create organization
const createOrganization = catchAsyncError( async (req,res,next) =>{

    const { userName, email, password, firstName, lastName, userType, organizationName, organizationDescription } = req.body;

    const passwordHash = await argon2.hash(password)
    let newUser;

    const t = await sequelize.transaction();

    newUser = await user.create({
        userName,
        email,
        passwordHash,
        firstName,
        lastName,
        userType,
        lastLogin: new Date()
      },{ transaction: t });

    let relatedData;

    let approved = true 
    relatedData = await organization.create({
        organizationName,
        organizationDescription,
        createdBy: newUser.id,
        approved

        },{ transaction: t });
    

    await t.commit();

    const response = {
    user: {
      id: newUser.id,
      adminUserName: newUser.userName,
      adminEmail: newUser.email,
      adminFirstName: newUser.firstName,
      adminLastName: newUser.lastName,
      userType: newUser.userType,
        organization: {
          organizationName: relatedData.organizationName,
          organizationDescription: relatedData.organizationDescription,
          approved: relatedData.approved
        }
    }
  }
  res.json({
    status: 'success',
    data : response,
    message : "Organization created successfully"
})
});

// approve agent
const approveAgent = catchAsyncError( async (req, res) => {
    
    const { id } = req.params;
    let fetchedAgnet = await agent.findByPk(id); 
    if (!fetchedAgnet) {
      return res.status(404).json({ message: 'agent not found' });
    }

    fetchedAgnet.approved = true
    await fetchedAgnet.save();

    res.status(200).json(fetchedAgnet);
  })

// approve organization
const approveOrganization = catchAsyncError( async (req, res) => {
    
      const { id } = req.params;
      let fetchedOrganization = await organization.findByPk(id); 
      if (!fetchedOrganization) {
        return res.status(404).json({ message: 'organization not found' });
      }
  
      fetchedOrganization.approved = true
      await fetchedOrganization.save();
  
      res.status(200).json(fetchedOrganization);
    })



    // Controller function to fetch unapproved organizations
    const getUnapprovedOrganizations =  catchAsyncError(async (req, res) => {
      
      const page = parseInt(req.query.page) || 1; // Default page is 1
      const limit = parseInt(req.query.limit) || 10  
      const offset = (page-1)* limit

      const unapprovedOrganizations = await organization.findAll({
          where: { approved: false },
          limit: limit,
          offset: offset,
          order: [['createdAt', 'DESC']]
        });
        

        if (unapprovedOrganizations.length === 0) {
          return res.status(404).json({ message: "No unapproved organizations found." });
        }
    
        return res.status(200).json(unapprovedOrganizations);
      
    });

     // Controller function to fetch unapproved organizations
     const getUnapprovedAgents =  catchAsyncError(async (req, res) => {

      const page = parseInt(req.query.page) || 1; // Default page is 1
      const limit = parseInt(req.query.limit) || 10  
      const offset = (page-1)* limit
      
      const unapprovedAgents = await agent.findAll({
        where: { approved: false },
        limit: limit,
        offset : offset,
        order: [['createdAt', 'DESC']]
      });
  
      if (unapprovedAgents.length === 0) {
        return res.status(404).json({ message: "No unapproved organizations found." });
      }
  
      return res.status(200).json(unapprovedAgents);
    
  });



  // Controller function to fetch unapproved organizations
  const getOrganizations =  catchAsyncError(async (req, res) => {
      
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10  
    const offset = (page-1)* limit

    const organizations = await organization.findAll({
        limit: limit,
        offset: offset
      });
      

      if (organizations.length === 0) {
        return res.status(404).json({ message: "No unapproved organizations found." });
      }
  
      return res.status(200).json(organizations);
    
  });

   // Controller function to fetch unapproved organizations
   const getAgents =  catchAsyncError(async (req, res) => {

    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10  
    const offset = (page-1)* limit
    
    const agents = await agent.findAll({
      limit: limit,
      offset : offset
    });

    if (agents.length === 0) {
      return res.status(404).json({ message: "No unapproved organizations found." });
    }

    return res.status(200).json(agents);
  
});
    
    
    


module.exports  = {createOrganization, approveOrganization, approveAgent, getUnapprovedOrganizations,getUnapprovedAgents, getAgents, getOrganizations}