const {createOrganization, approveOrganization, approveAgent, getUnapprovedOrganizations, getUnapprovedAgents, getAgents, getOrganizations} = require('../controller/adminController')
const { authentication, restrictTo } = require('../middleware/authMiddleware')
const router = require('express').Router()

router.route('/create_org_member').post(authentication,restrictTo("SuperAdmin"),createOrganization)
router.route('/approve-organization/:id').patch(authentication,restrictTo("SuperAdmin"),approveOrganization)
router.route('/approve-agent/:id').patch(authentication,restrictTo("SuperAdmin"),approveAgent)
router.route('/get-unapproved-agents').get(authentication,restrictTo("SuperAdmin"),getUnapprovedAgents)
router.route('/get-unapproved-organizations').get(authentication,restrictTo("SuperAdmin"),getUnapprovedOrganizations)
router.route('/get-agents').get(authentication,restrictTo("SuperAdmin"),getAgents)
router.route('/get-organizations').get(authentication,restrictTo("SuperAdmin"),getOrganizations)
module.exports = router