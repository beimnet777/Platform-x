const sequelize = require("../config/database");
const form = require("../db/models/form/form");
const question = require("../db/models/form/question");
const response = require("../db/models/response/response");
const responseDetail = require("../db/models/response/responsedetail");
const agent = require("../db/models/user/agent");
const user = require("../db/models/user/user");
const catchAsyncError = require("../utils/catchAsyncError");
const { Op } = require('sequelize');

const getAgentFormsFeed = catchAsyncError(async (req, res) => {
    const { page = 1, limit = 10, tags } = req.query; // Added tags parameter from query
    const userId = req.user.id;

    // Fetch agent profile
    const agentObject = await agent.findOne({ where: { userId: userId } });
    if (!agentObject) {
        return res.status(404).json({ message: 'Agent not found' });
    }

    const { gender, age } = agentObject;
    console.log(gender, age);

    // Initialize where conditions
    const whereCondition = {
        isOpen: true, // Form must be open
        agentGender: {
            [Op.contains]: [gender], // Match gender
        },
        minAgentAge: {
            [Op.lte]: age, // Agent age is greater or equal to min age
        },
        maxAgentAge: {
            [Op.gte]: age, // Agent age is less or equal to max age
        },
    };

    // If tags are provided, add the tags filter
    if (tags) {
        const tagsArray = tags.split(','); // Convert comma-separated tags to array
        whereCondition.tags = {
            [Op.contains]: tagsArray, // Match forms that contain the provided tags
        };
    }

    // Fetch forms that match the agent's profile, open status, and tags if provided
    const forms = await form.findAndCountAll({
        where: whereCondition,
        order: [['createdAt', 'DESC']], // Sort by most recent
        limit: parseInt(limit),
        offset: (page - 1) * limit,
    });

    const totalPages = Math.ceil(forms.count / limit);

    // Next page URL
    const nextPage = page < totalPages ? `/forms/feed?page=${parseInt(page) + 1}&limit=${limit}` : null;
    const prevPage = page > 1 ? `/forms/feed?page=${parseInt(page) - 1}&limit=${limit}` : null;

    res.status(200).json({
        currentPage: page,
        totalPages,
        nextPage,
        prevPage,
        forms: forms.rows,
    });
});

const getTaskHistory = catchAsyncError( async (req, res) => {
      // Fetch all tasks for the agent
      const agentObject = await agent.findOne({ where: { userId: req.user.id } });
      const agentId = agentObject.id
      const tasks = await response.findAll({
        where: {
            agentId: agentId
        },
        include: [
            {
                model: responseDetail,
                attributes: ['id', 'questionId', 'responseText', 'responseFilePath', 'isValid']
            },
            {
                model: form,
                attributes: ['id', 'formName', 'formDescription', 'estimatedTime', 'tags', 'reward'],
                include: [
                    {
                        model: question,
                        attributes: ['id', 'questionTitle', 'questionDescription']
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']] // Sort tasks by creation date
    });
  
      // Separate tasks based on their isValid status
      const acceptedTasks = tasks.filter(task => task.isValid === true);
      const waitingApproval = tasks.filter(task => task.isValid === false || task.isValid === null);
  
      // Return the data
      res.json({
        acceptedTasks,
        waitingApproval
      });
    
  });


const getAgentProfile = catchAsyncError(
    async (req,res,next) =>{
        const agentProfile = await agent.findOne({ where: { userId: req.user.id } })

        if( !agentProfile){
            res.status(404).json({
                message : "agent can not be found"
            })
        }

        res.json(agentProfile)
    }
)
  
  

module.exports = {getAgentFormsFeed, getTaskHistory, getAgentProfile}
