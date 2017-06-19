'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');
var passport = require('passport');
var multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();


var ctrl = {
    home: require('../controllers/home'),
    user: require('../controllers/users'),
    common: require('../controllers/common'),
};


// Define the home page route
router.get('/', ctrl.home.ampIndex);









// ----------------------------------------------------------------------------------
// 	Common Block for DB service API
// ----------------------------------------------------------------------------------


router.post('/api/common/add-data', ctrl.common.postAddData);
router.post('/api/common/get-data', ctrl.common.getData);
router.post('/api/common/single-data', ctrl.common.getSingle);
router.post('/api/common/condition-data', ctrl.common.getCondition);
router.post('/api/common/edit-data', ctrl.common.getEditData);
router.post('/api/common/delete', ctrl.common.getDeleteData);
router.post('/api/common/:key/file-uploads', multipartMiddleware, ctrl.common.commonUploadFile);
router.post('/api/common/order-change', ctrl.common.orderChange);









// ----------------------------------------------------------------------------------
// 	User Stuff
// ----------------------------------------------------------------------------------


router.post('/login', ctrl.user._login);
router.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});
router.post('/api/user/register', ctrl.user.register);
router.get('/api/user/me', ctrl.user.getCurrentLoggedUserData);
router.post('/api/user/forgot-password', ctrl.user.forgotPasswordRequest);
router.post('/api/user/reset/:token', ctrl.user.resetPassword);
router.get('/user/logout', ctrl.user.logout);
router.post('/api/user/resend-activation-email', ctrl.user.resendActionEmail);
router.post('/api/user/email-change-confirmation', ctrl.user.emailChangeConfirmation);
router.post('/api/user/get-logged-user-data', ctrl.user.getCurrentLoggedUserData);
router.post('/api/get/register-member', ctrl.user.getRegisterMember);
router.post('/api/user/register-member-activation', ctrl.user.activatedManualy);



module.exports = router;
