const { signup, login, changePassword, getProfile } = require('../controller/authController')
const { authentication } = require('../middleware/authMiddleware')

const router = require('express').Router()

router.route('/signup/agent').post(signup)
router.route('/signup/organization').post(signup)
router.route('/login').post(login)
router.route('/change-password').patch(authentication, changePassword)
router.route('/get-profile').get(authentication, getProfile)
module.exports = router