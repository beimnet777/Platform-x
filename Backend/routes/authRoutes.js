const { signup, login } = require('../controller/authController')

const router = require('express').Router()

router.route('/signup/agent').post(signup)
router.route('/signup/organization').post(signup)
router.route('/login').post(login)

module.exports = router