const { createForm } = require('../controller/formController')
const {createOrgMember, getFormsByOrganization, getResponsesByForm, getResponseStatsByForm, getResponseStatsByOrganization, validateResponse, getFormQuestions }= require('../controller/orgAdminController')
const { authentication, restrictTo } = require('../middleware/authMiddleware')
const router = require('express').Router()

router.route('/create_org_member').post(authentication,restrictTo("OrgAdmin"),createOrgMember)
router.route('/create_form').post(authentication,restrictTo("OrgAdmin"),createForm)
router.route('/get-forms').get(authentication,restrictTo("OrgAdmin", "OrgMember"),getFormsByOrganization)
router.route('/get-responses/:formId').get(authentication,restrictTo("OrgAdmin", "OrgMember"),getResponsesByForm)
router.route('/get-form-questions/:formId').get(authentication,restrictTo("OrgAdmin", "OrgMember"),getFormQuestions)

router.route('/get-form-response-stat/:formId/').get(authentication,restrictTo("OrgAdmin", "OrgMember"),getResponseStatsByForm);
router.route('/get-organization-response-stat/').get(authentication,restrictTo("OrgAdmin", "OrgMember"), getResponseStatsByOrganization);
router.route('/validate-response/:responseId').patch(authentication,restrictTo("OrgAdmin", "OrgMember"), validateResponse);


module.exports = router