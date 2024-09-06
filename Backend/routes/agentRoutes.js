const { submitForm } = require('../controller/formController')
const { authentication, restrictTo } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/fileUpload')
const router = require('express').Router()

router.route('/submitForm').post(authentication,restrictTo("Agent"),upload.any(), submitForm)

module.exports = router