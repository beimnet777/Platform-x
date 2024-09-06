const { createForm } = require('../controller/formController')
const createOrgMember= require('../controller/orgAdminController')
const { authentication, restrictTo } = require('../middleware/authMiddleware')
const router = require('express').Router()

router.route('/create_org_member').post(authentication,restrictTo("OrgAdmin"),createOrgMember)
router.route('/create_form').post(authentication,restrictTo("OrgAdmin"),createForm)

module.exports = router