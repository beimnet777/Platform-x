const { createForm } = require('../controller/formController')
const {createOrgMember, getFormsByOrganization, getResponsesByForm, getResponseStatsByForm, getResponseStatsByOrganization }= require('../controller/orgAdminController')
const { authentication, restrictTo } = require('../middleware/authMiddleware')
const router = require('express').Router()

router.route('/create_org_member').post(authentication,restrictTo("OrgAdmin"),createOrgMember)
router.route('/create_form').post(authentication,restrictTo("OrgAdmin"),createForm)
router.route('/get-forms').get(authentication,restrictTo("OrgAdmin"),getFormsByOrganization)
router.route('/get-responses/:formId').get(authentication,restrictTo("OrgAdmin"),getResponsesByForm)

router.route('/get-form-response-stat/:formId/').get(authentication,restrictTo("OrgAdmin"),getResponseStatsByForm);
router.route('/get-organization-response-stat/').get(authentication,restrictTo("OrgAdmin"), getResponseStatsByOrganization);


module.exports = router