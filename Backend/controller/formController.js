const { sequelize } = require("../db/models");
const form = require("../db/models/form/form");
const question = require("../db/models/form/question");
const response = require("../db/models/response/response");
const responseDetail = require("../db/models/response/responsedetail");
const agent = require("../db/models/user/agent");
const organization = require("../db/models/user/organization");
const catchAsyncError = require("../utils/catchAsyncError");


const createForm = catchAsyncError( async (req, res) => {
  const { 
    formName, 
    formDescription, 
    isOpen, 
    numberOfQuestion, 
    totalResponse, 
    minAgentAge, 
    maxAgentAge, 
    agentGender, 
    questions 
  } =  req.body;
  

  // Validate required fields
  if (!formName || !formDescription || !numberOfQuestion || !totalResponse || !minAgentAge || !maxAgentAge || !agentGender || !questions) {
    return res.status(400).json({ error: 'All required fields must be provided.' });
  }

  const organizationObject = await organization.findOne({where: { createdBy: req.user.id }})
  const organizationId = organizationObject.dataValues.id
  

  // Start a transaction
  const t = await sequelize.transaction();
  
    const newForm = await form.create({
     
      formName,
      organizationId,
      formDescription,
      isOpen,
      numberOfQuestion,
      totalResponse,
      currentResponse: 0,
      minAgentAge,
      maxAgentAge,
      agentGender,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { transaction: t });

    console.log(newForm)
    let savedQuestions  = []
    for (const q of questions) {
      savedQuestions.push( await question.create({
        formId: newForm.id,
        questionTitle: q.questionTitle,
        questionDescription: q.questionDescription,
        questionType: q.questionType,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { transaction: t }));
    }

    await t.commit();

    res.status(201).json({ 
      form: newForm, 
      savedQuestions 
    });
});




const submitForm =catchAsyncError( async (req, res) => {
  
    const { formId, answers } = req.body;

    const agentObject = await agent.findOne({where: { userId: req.user.id }})
    if (!agentObject){
      return res.status(404).json({
        message : "agent is not found"
      })
    }
    const agentId = agentObject.dataValues.id

    
    // form exists?
    const formRecord = await form.findOne({ where: { id: formId } });
    if (!formRecord) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // already responded
    const existingResponse = await response.findOne({ where: { formId, agentId: agentId } });
    if (existingResponse) {
      return res.status(400).json({ message: 'You have already submitted this form' });
    }
    // form reached limit or is closed (don't send me the form it is not open)
    if ( !formRecord.isOpen) {
        return res.status(400).json({ message: 'This form has reached its response limit or it is closed' });
      }


    const t = await sequelize.transaction()

    // Create a new response
    const newResponse = await response.create({
      agentId,
      formId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },{transaction:t});

    
    for (const answer of answers) {
      const { questionId, responseText } = answer;

      // Ensure the question belongs to the form
      const questionExists = await question.findOne({
        where: { id: questionId, formId },
      });
      if (!questionExists) {
        return res
          .status(400)
          .json({ message: `Question ${questionId} does not belong to form ${formId}` });
      }
      let responseFilePath = ""

      if (req.files && req.files[questionId]) {
        responseFilePath = req.files[questionId][0].path; // Save file path
      }

      // Create response detail for each answer
      await responseDetail.create({
        questionId,
        responseId: newResponse.id,
        responseText,
        responseFilePath,
        createdAt: new Date(),
        updatedAt: new Date(),
      },{transaction:t});
    }


    agentObject.totalMoneyEarned +=50
    agentObject.currentBalance+=50

    await agentObject.save()

    formRecord.currentResponse +=1
    if (formRecord.currentResponse ==  formRecord.totalResponse){
        formRecord.isOpen=false
    }

    await formRecord.save()

    await t.commit()


    return res.status(201).json({
      message: 'Form submission successful',
      responseId: newResponse.id,
    });
  
});

const getFormQuestions  = catchAsyncError( async (req, res) => {
  const { formId } = req.params;

      // Find the form by its ID, including its related questions
      const formWithQuestions = await form.findOne({
          where: { id: formId },
          include: [{
              model: question,
              attributes: ['id', 'questionTitle', 'questionDescription', 'questionType'] // Adjust attributes based on your question model
          }],
          order : [['createdAt', 'DESC']]
      });

      // If no form is found, return 404
      if (!formWithQuestions) {
          return res.status(404).json({ message: "Form not found" });
      }

      // Return the questions
      res.status(200).json({
          formId: formWithQuestions.id,
          formName: formWithQuestions.formName,
          questions: formWithQuestions.questions
      });
});

module.exports = { createForm ,submitForm, getFormQuestions};
