'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    users = require('../models/user'),
    User = mongoose.model('User'),
    async = require('async'),
    hbs = require('hbs'),
    fs = require('fs'),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    request = require('request'),
    expressValidator = require('express-validator');








exports.emailChangeConfirmation = function(req, res) {

    //
    var activationEmailObj = {
        toEmail: req.body.email,
        dynamicFields: {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.body.email,
            activation_url: 'http://' + req.headers.host + '/activation/' + req.user._id + '/upgrade'
        }
    }


    //
    // commonCtr.directSendEmail('5943c0e75c97d17dac1e5fa4', activationEmailObj, req.headers.host, '', function(status, type) {


    // });
    helperCTRL.sendSESEmail('5943c0e75c97d17dac1e5fa4', activationEmailObj);
}






//
var mailTemplateId = '';


/**
 * 
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};





/**
 * Edit user
 */
exports.editUser = function(req, res) {

    //
    req.assert('first_name', 'You must enter a first name').notEmpty();
    req.assert('last_name', 'You must enter a last name').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    User.update({
            '_id': req.params.userId
        },
        req.body
    ).exec(function(err, result) {
        if (result) {
            return res.json({
                status: true,
                message: 'Your Profile has been updated successfully'
            });
        }
        return res.json({
            status: false,
            message: 'Your Profile has been updated successfully'
        });
    });
};






/**
 *
 */
exports.userActivation = function(req, res) {
    User.update({
        '_id': req.params.token
    }, {
        isActivate: true
    }).exec(function(err, result) {

        if (err) {
            res.json({
                status: false
            });
            return res.redirect('/?registration-activated=no');
        }

        return res.redirect('/?registration-activated=yes');
    });
}








/**
 *
 */
exports.userEmailUpdate = function(req, res) {
    User.update({
        '_id': mongoose.Types.ObjectId(req.params.token)
    }, {
        isEmailUpdate: true
    }).exec(function(err, result) {

        if (err) {
            res.json({
                status: false
            });
            return res.redirect('/?registration-activated=no');
        }

        return res.redirect('/?registration-activated=yes');
    });
}








/**
 * Show login form
 */
exports.signin = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.redirect('#!/login');
};








/**
 * Logout
 */
exports.logout = function(req, res) {

    //
    if (res.session && res.session.user) {
        res.session.user = undefined;
    }

    //
    req.logout();

    //
    req.session.destroy(function(err) {
        res.redirect('/');
    });
};









/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};









/**
 * Create user
 */
exports.register = function(req, res, next) {

    //
    var userModel = mongoose.model('User');

    //
    userModel.find({
        email: req.body.email
    }).exec(function(err, result) {

        if (err) {
            console.log('ERR', err);
            return;
        }


        if (result && result.length) {
            res.json({
                status: 1,
                message: 'Email already taken',
            });
            return;
        }


        var user = new User(req.body);

        user.provider = 'local';

        // because we set our user.provider to local our models/user.js validation will always be true
        req.assert('email', 'You must enter a valid email address').isEmail();
        req.assert('password', 'Password too short').len(8, 20);

        var errors = req.validationErrors();
        if (errors) {
            return res.json({status: false, message: errors[0].msg});
        }

        // Hard coded for now. Will address this with the user permissions system in v0.3.5
        user.roles = ['admin'];
        user.isActivate = false;
        user.isEmailUpdate = false;
        user.save(function(err, result) {

            req.logIn(user, function(err) {

                if (err) return next(err);

                //
                res.json({status: true, data: user});
            });

            res.status(200);
        });
    });

};






/**
 *
 */
exports.getCurrentLoggedUserData = function(req, res) {
    res.json(req.user || null);
};




/**
 * 
 */
exports.activatedManualy = function(req, res) {

    if (req.query.token != '59085349b5848c2b733a6df1') {
        return;
    }

    var userModel = mongoose.model('User');

    userModel.findOne({
        email: req.query.email
    }).exec(function(err, result) {

        if (err || !result) {
            res.send('No User Found !');
            return;
        }

        result.isActivate = true;
        result.save(function(err, result) {
            res.send('User Activated successfully');
        });
    });

}









/**
 * USer Login
 */
exports._login = function(req, res) {

    //
    var userModel = mongoose.model('User');


    //
    userModel.findOne({
        email: req.body.email
    }, function(err, user) {

        //

        if (user && user._id && !user.isActivate) {
            res.json({
                message: 'Sorry, Your account is not verified yet.',
                status: false
            });
            return;
        }

        //
        if (err || !user) {
            res.json({
                message: 'User not found',
                status: false
            });
            return;
        }

        if (!user.authenticate(req.body.password)) {
            res.json({
                message: 'User name or password is invalid.',
                status: false
            });
            return;
        }

        //
        user = JSON.parse(JSON.stringify(user));
        req.session.user = user;

        //
        res.json({
            status: true,
            data: user
        });

    });

}









/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User.findOne({
        _id: id
    }).exec(function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        req.profile = user;
        next();
    });
};









/**
 * Change the password
 */
exports.changeUserPassword = function(req, res, next) {

    User.findOne({
        _id: req.body.userId
    }, function(err, user) {
        if (err) {
            return res.status(400).json({
                msg: err
            });
        }
        if (!user) {
            return res.status(400).json({
                msg: 'Unknown user'
            });
        }
        if (!user.authenticate(req.body.userOldPassword)) {
            return res.status(400).json({
                msg: 'Invalid password'
            });
        }

        req.assert('userNewPassword', 'New password must be between 8-20 characters long').len(8, 20);
        req.assert('userConfirmPassword', 'Passwords do not match').equals(req.body.userNewPassword);

        var errors = req.validationErrors();
        if (errors) {
            return res.status(400).send(errors);
        }

        user.password = req.body.userNewPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err) {
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.send({
                    user: user,
                });
            });
        });
    });
};









/**
 * Resets the password
 */
exports.resetPassword = function(req, res, next) {

    //
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: new Date().getTime()
        }
    }, function(err, user) {
        if (err) {
            return res.status(400).json({
                msg: err
            });
        }
        if (!user) {
            return res.status(400).json({
                msg: 'Token invalid or expired'
            });
        }
        req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
        req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
        var errors = req.validationErrors();
        if (errors) {
            return res.status(400).send(errors);
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err) {
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.send({
                    user: user
                });
            });
        });
    });
};









/**
 * Callback for forgot password link
 */
exports.forgotPasswordRequest = function(req, res, next) {

    async.waterfall([

            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {

                User.findOne({
                    companyId: req.session.companyId,
                    $or: [{
                        email: req.body.text
                    }, {
                        username: req.body.text
                    }]
                }, function(err, user) {

                    //
                    if (err) return done(true);


                    if (user && user._id) {
                        done(err, user, token);
                    } else {

                        var companyModel = mongoose.model('Company');

                        companyModel.findOne({
                            _id: req.session.companyId
                        }).exec(function(erx, companyData) {

                            if (companyData) {

                                User.findOne({
                                    _id: companyData.userId
                                }, function(err, userSingleData) {

                                    if (userSingleData && userSingleData._id) {
                                        if (req.body.text && userSingleData.email && userSingleData.email.toLowerCase() == req.body.text.toLowerCase()) {
                                            done(err, userSingleData, token);
                                        }
                                    } else {
                                        done(true);
                                    }

                                });

                            } else {
                                done(true);
                            }

                        });
                    }

                });
            },
            function(user, token, done) {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Math.floor(new Date().getTime() + 3600000);
                user.save(function(err) {
                    done(err, token, user);
                });
            },
            function(token, user, done) {

                //
                var fogotPasswordLinkEmailObj = {
                    toEmail: user.email,
                    bccEmail: user.email,
                    dynamicFields: {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        forgot_link_url: 'http://' + req.headers.host + '/#!/reset/' + token
                    }
                }

                // commonCtr.directSendEmail('5943bbb75c97d17dac1e5fa1', fogotPasswordLinkEmailObj, req.headers.host);
                helperCTRL.sendSESEmail('5943bbb75c97d17dac1e5fa1', fogotPasswordLinkEmailObj);

                done(null, true);
            }
        ],
        function(err, status) {
            var response = {
                message: 'Mail has been sent successfully',
                status: 'success'
            };
            if (err) {
                response.message = 'User does not exist';
                response.status = 'danger';
            }
            res.json(response);
        }
    );
};









/**
 * Resend activation email
 */
exports.resendActionEmail = function(req, res) {

    //
    if (!req.body.email) {
        res.json({
            status: false,
            error: 'Email field is required',
            key: 0
        });
        return;
    }

    //
    User.findOne({
        email: req.body.email,
        // companyId: '0'
    }, function(err, user) {

        if (user && user.isActivate) {
            res.json({
                status: false,
                key: 1
            });
            return;
        }

        //
        var activationEmailObj = {
            toEmail: user.email,
            dynamicFields: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                activation_url: 'http://' + req.headers.host + '/#!/user/invitation-confirm-email/' + user._id
            }
        }

        //
        // commonCtr.directSendEmail('5943b91d5c97d17dac1e5fa0', activationEmailObj, req.headers.host);
        helperCTRL.sendSESEmail('5943b91d5c97d17dac1e5fa0', activationEmailObj);

        //
        res.json({
            status: true,
            key: 3
        });

    });

}









/**
 *
 */
exports.getCurrentLoggedUserData = function(req, res) {

    if (req.user || req.session.user) {

        User.findOne({
            _id: req.user._id || req.session.user._id
        }, function(err, user) {
            res.json(user);
        });
    }
}









/**
 *
 */
exports.getRegisterMember = function(req, res) {
    User.findOne({
        _id: req.body.userId
    }, function(err, user) {

        if (user) {

            var companyModel = mongoose.model('Company');

            companyModel.findOne({
                _id: user.companyId
            }, {
                subDomain: true
            }).exec(function(err, companyD) {

                res.json({
                    email: user.email,
                    isActivate: user.isActivate,
                    subDomain: companyD.subDomain,
                    envType: process.env.NODE_ENV,
                });
            });

        } else {

            res.json();
        }
    });
}