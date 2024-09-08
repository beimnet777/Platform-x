const {createOrganization, approveOrganization, approveAgent} = require('../controller/adminController')
const { authentication, restrictTo } = require('../middleware/authMiddleware')
const router = require('express').Router()

router.route('/create_org_member').post(authentication,restrictTo("SuperAdmin"),createOrganization)
router.route('/approve-organization/:id').patch(authentication,restrictTo("SuperAdmin"),approveOrganization)
router.route('/approve-agent/:id').patch(authentication,restrictTo("SuperAdmin"),approveAgent)
module.exports = router