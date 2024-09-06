const createOrgMember= require('../controller/orgAdminController')
const { authentication, restrictTo } = require('../middleware/authMiddleware')
const router = require('express').Router()

router.route('/create_org_member').post(authentication,restrictTo("OrgAdmin"),createOrgMember)

module.exports = router