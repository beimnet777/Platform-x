const user = require('../db/models/user/user')
const agent = require('../db/models/user/agent')
const organization = require('../db/models/user/organization')
const sequelize  = require ('../config/database')

const argon2 = require("argon2")
const jwt = require ("jsonwebtoken")
const AppError = require("../utils/appError")
const catchAsyncError = require("../utils/catchAsyncError")

const generateToken = (payLoad) =>{
    return jwt.sign(payLoad, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRATION_DATE
    })
}



const signup = catchAsyncError( async (req,res,next) =>{

    const { userName, email, password, firstName, lastName, userType, gender, age, organizationName, organizationDescription } = req.body;

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
    let message;
    if (userType === 'Agent') {
    relatedData = await agent.create({
        userId: newUser.id,   
        gender,
        age
    },{ transaction: t });}
    else if (userType === 'OrgAdmin') {
        relatedData = await organization.create({
            organizationName,
            organizationDescription,
            createdBy: newUser.id,
        },{ transaction: t });
    }

    await t.commit();

const response = {
    message: "Signup successful",
    user: {
      id: newUser.id,
      userName: newUser.userName,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      userType: newUser.userType,
      ...(userType === 'Agent' && {
        agent: {
          gender: relatedData.gender,
          age: relatedData.age,
          currentBalance: relatedData.currentBalance,
          approved: relatedData.approved
        }
      }),
      ...(userType === 'OrgAdmin' && {
        organization: {
          organizationName: relatedData.organizationName,
          organizationDescription: relatedData.organizationDescription,
          approved: relatedData.approved
        }
      })
    }
  };

    

  response.token = generateToken({
        id: response.id
    }) 
    res.json({
        status: 'success',
        data : response,
        message : "User signed up successfuly"
    })
})

const login =catchAsyncError( async (req, res, next) =>{
    const {email, password} = req.body

    if (!email || !password ){
        throw new AppError(message="email or password not provided", statusCode=400)
    }
    
    const result = await user.findOne({where: { email: email}})
    
    if (!result || !(await argon2.verify(result.passwordHash, password))){
        throw new AppError(message="incorrect email or password ", statusCode=400)
    }

    const token = result.token = generateToken({
        id: result.id
    })

    return res.json({
        status:"success",
        token
    })
})



module.exports = { signup ,login}