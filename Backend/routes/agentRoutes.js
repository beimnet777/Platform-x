const {getAgentFormsFeed,getTaskHistory, getAgentProfile} = require('../controller/agentController')
const { submitForm, getFormQuestions } = require('../controller/formController')
const { authentication, restrictTo } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/fileUpload')
const router = require('express').Router()

router.route('/submitForm').post(authentication,restrictTo("Agent"),upload.any(), submitForm)
router.route('/get-forms').get(authentication,restrictTo("Agent"), getAgentFormsFeed)
router.route('/get-form-question/:formId').get(authentication,restrictTo("Agent"), getFormQuestions)
router.route('/get-task-history/').get(authentication,restrictTo("Agent"), getTaskHistory)
router.route('/get-agent-profile/').get(authentication,restrictTo("Agent"), getAgentProfile)


module.exports = router