const { createForm } = require('../controller/formController')
const {createOrgMember, getFormsByOrganization, getResponsesByForm, getResponseStatsByForm, getResponseStatsByOrganization, validateResponse, getFormQuestions }= require('../controller/orgAdminController')
const { authentication, restrictTo } = require('../middleware/authMiddleware')
const router = require('express').Router()

router.route('/create_org_member').post(authentication,restrictTo("OrgAdmin"),createOrgMember)
router.route('/create_form').post(authentication,restrictTo("OrgAdmin"),createForm)
router.route('/get-forms').get(authentication,restrictTo("OrgAdmin"),getFormsByOrganization)
router.route('/get-responses/:formId').get(authentication,restrictTo("OrgAdmin"),getResponsesByForm)
router.route('/get-form-questions/:formId').get(authentication,restrictTo("OrgAdmin"),getFormQuestions)

router.route('/get-form-response-stat/:formId/').get(authentication,restrictTo("OrgAdmin"),getResponseStatsByForm);
router.route('/get-organization-response-stat/').get(authentication,restrictTo("OrgAdmin"), getResponseStatsByOrganization);
router.route('/validate-response/:responseId').patch(authentication,restrictTo("OrgAdmin"), validateResponse);


module.exports = router