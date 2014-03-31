/* jshint camelcase: false, multistr: true */

'use strict';

var swagger = require('swagger-node-express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    sendgrid  = require('sendgrid')(
        process.env.SENDGRID_USERNAME,
        process.env.SENDGRID_PASSWORD
    );


var ProjectModel = require('../models/project-model'),
    UserModel = require('../models/user-model'),
    userWordList = require('../words-for-usernames.json'),
    generateUniqueUsername = require('../helpers/username-generator');


/**
 * Local authentication strategy
 */
passport.use(new LocalStrategy(

    function(username, password, done) {
        UserModel.findOne({username: username}, function(err, user) {

            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }

            return done(null, user);
        });
    }
));


/**
 * Serialization routine
 */
passport.serializeUser(function(user, done) {
    done(null, user.username);
});


/**
 * Deserialization routine
 */
passport.deserializeUser(function(username, done) {
    UserModel.findOne({ username: username}, done);
});


/**
 * Get a user by their username, or the currently logged in user
 *
 * NB. At first glance this looks like a security hole to allow anyone to get a user from their username,
 * but remember that usernames are basically the passwords - if you have someone's username you could just
 * log in as them anyway. That's why we shouldn't show your username to anyone else. Remember that there
 * is no personally identifiable information here though, so in the bad scenario that someone steals your username,
 * the very worst they could do is edit or delete your projects...
 */
exports.getUserByUsernameOrMe = {
    'spec': {
        'description': 'Get a single user by a username',
        'path': '/users/{username}?',
        'notes': 'Returns a User Profile',
        'summary': 'Find user by a username or return signed in user',
        'method': 'GET',
        'params': [swagger.pathParam('username', 'Username of user that needs to be fetched', 'string')],
        'responseClass': 'User',
        'errorResponses': [
            swagger.errors.invalid('username'),
            swagger.errors.notFound('user')
        ],
        'nickname': 'getUserByUsernameOrMe'
    },
    'action': function (req, res) {
        console.log('Get user', req.params);

        var username;

        if( req.params.username ) {
            username = req.params.username;
        } else if( req.isAuthenticated() && req.user && req.user.username ) {
            username = req.user.username;
        } else {
            return swagger.errors.forbidden(res);
        }

        /**
         * Find User by username and return
         */
        UserModel.findOne({username: username}, function (err, user) {
            if (err) {
                console.log(err);
                return swagger.stopWithError(res);
            }

            if (!user) {
                return swagger.errors.notFound('user', res);
            }

            // Fetch the main properties of the user's projects at the same time
            // NB. We don't include the whole projects, just the attributes defined here...
            ProjectModel.find({author_id: user._id}, {'_id': 1, 'tutorial_id': 1, 'name': 1, 'updated_at': 1}).sort({'updated_at': -1}).execFind(function (err, projects) {
                if (err) {
                    console.log(err);
                    return swagger.stopWithError(res);
                }

                user = user.toObject(); // Otherwise we can't add properties
                user.projects = projects;

                // Ensure result isn't cached, for purposes of logging out and updating next_tutorial_number
                // (Had problems in Internet Explorer)
                res.setHeader('Cache-Control', 'no-cache, must-revalidate');

                return res.json({
                    message: 'Success',
                    data: user
                });
            });
        });
    }
};


/**
 * Update (save) a user with their latest tutorial level
 */
exports.updateUser = {
    'spec': {
        'description': 'Update (save) a user',
        'path': '/users/{username}',
        'notes': 'Accepts a JSON payload',
        'summary': 'Update a user',
        'method': 'PUT',
        'params': [swagger.pathParam('username', 'Username of user that needs to be fetched', 'string')],
        'errorResponses': [
            swagger.errors.forbidden(),
            swagger.errors.notFound('user')
        ],
        'nickname': 'updateUser'
    },
    'action': function( req, res ) {
        console.log('Update user', req.params);

        var username = null;

        if( req.isAuthenticated() && req.user && req.user.username ) {

            if( req.user.username === req.params.username) {
                username = req.user.username;
            } else {
                console.log('Supplied username does not match authenticated user');
            }

        }

        if( !username ) {
            return swagger.errors.forbidden(res);
        }

        UserModel.findOne({username: username}, function(errUser, user) {
            if( errUser ) {
                console.log(errUser);
                return swagger.stopWithError(res);
            }

            if( !user ) {
                return swagger.errors.notFound('user', res);
            }

            var propertiesToUpdate = [
                'next_tutorial_level',
                'next_tutorial_number'
            ];

            propertiesToUpdate.forEach(function (property) {
                if( req.body[property] ) {
                    console.log('Update', property, req.body[property]);
                    user[property] = req.body[property];
                }
            });

            user.save(function(errSave, savedUser) {
                if( errSave || !savedUser ) {
                    console.log( errSave );
                    return swagger.stopWithError(res);
                }

                return res.json({
                    message: 'Success'
                });

            });
        });
    }
};


/**
 * Sign up a new user
 */
exports.signUp = {
    'spec': {
        'description': 'Sign up a new user',
        'path': '/user/sign_up',
        'notes': 'Returns a User information Object',
        'summary': 'Sign up a new user',
        'method': 'POST',
        'params': [],
        'responseClass': 'LogInResponse',
        'errorResponses': [swagger.errors.forbidden()],
        'nickname': 'userSignUp'
    },
    'action': function(req, res) {
        console.log('Sign up', req.params);

        generateUniqueUsername(userWordList, function(err, username) {
            if (err) {
                console.log(err);
                return swagger.stopWithError(res);
            }

            var user = new UserModel({
                'username': username,
                'next_tutorial_level': 1,
                'next_tutorial_number': 1
            });


            user.save(function(err, savedUser) {
                if (err || !savedUser) {
                    console.log(err);
                    return swagger.stopWithError(res);
                }

                req.logIn(user, function(err) {
                    if (err) {
                        console.log(err);
                        return swagger.errors.forbidden(res);
                    }

                    return res.json({
                        'username': savedUser.username,
                    });
                });
            });
        });
    }
};


/**
 * Sign in as an existing user
 */
exports.signIn = {
    'spec': {
        'description': 'Sign in an existing user',
        'path': '/user/sign_in',
        'notes': 'Returns a User information Object',
        'summary': 'Sign in an existing user',
        'method': 'POST',
        'params': [
            swagger.formParam('username', 'User name', 'string'),
            swagger.formParam('password', 'Dummy password', 'string')
        ],
        'responseClass': 'LogInResponse',
        'errorResponses': [
            swagger.errors.forbidden(),
            swagger.errors.notFound('project')
        ],
        'nickname': 'userSignIn'
    },
    'action': function (req, res) {
        console.log('Sign in', req.body);

        passport.authenticate('local', function (err, user) {

            if (err) {
                console.log(err);
                return swagger.stopWithError(res);
            }

            if (!user) {
                return swagger.errors.forbidden(res);
            }

            req.logIn(user, function (err) {
                if (err) {
                    console.log(err);
                    return swagger.errors.forbidden(res);
                }

                console.log('UserId:', user._id);

                return res.json({
                    'username': user.username
                });
            });
        })(req, res);

    }
};


/**
 * Sign out the current user
 */
exports.signOut = {
    'spec': {
        'description': 'Sign out a signed in user',
        'path': '/user/sign_out',
        'notes': 'Sign out the current user',
        'summary': 'Sign out the current user',
        'method': 'POST',
        'params': [],
        'errorResponses': [],
        'nickname': 'userSignOut'
    },
    'action': function (req, res) {
        console.log('Sign out', req.params);

        req.logout();
        res.send(200);
    }
};


/**
 * Send username reminder email
 */
exports.sendUsernameByEmail = {
    'spec': {
        'description': 'Send the current user an email with their username',
        'path': '/user/email',
        'notes': 'Sends the current user\'s username by email',
        'summary': 'Sends the current user an email with their username',
        'method': 'POST',
        'params': [
            swagger.bodyParam('email', 'User\'s email address')
        ],
        'errorResponses': [
            swagger.errors.forbidden()
        ],
        'nickname': 'sendUsernameByEmail'
    },
    'action': function (req, res) {
        console.log('Send username by email', req.body);

        var email = req.body.email;
        var username = req.user.username;

        if (req.isAuthenticated() && username) {
            sendgrid.send({
                to: email,
                from: 'info@letsc.de',
                subject: 'Your Let’s Code! username',
                text: 'Thank you for signing up to Let’s Code!\n\
Your username is '+username+'. You will need it when you log onto Let\'s Code! so please keep this email safe in case you forget your username.\n\
Thank you for signing up to Let’s Code!\n\
Enjoy!\n\
The Let’s Code! team\n\
<a href="http://letsc.de">Take me to Let\'s Code! now.</a>',

                html: '<h1>Thank you for signing up to Let’s Code!</h1>\
                       <p>Your username is '+username+'. You will need it when you log onto Let\'s Code! so please keep this email safe in case you forget your username</p>\
                       <p>Thank you for signing up to Let’s Code!</p>\
                       <p>Enjoy!</p>\
                       <p>The Let’s Code! team</p>\
                       <a href="http://letsc.de">Take me to Let\'s Code! now.</a>'
            }, function(err, json) {
                if (err) {
                    console.error(err);
                    return swagger.stopWithError(res);
                }

                return res.json({
                    message: 'Success',
                    data: json
                });
            });
        } else {
            return swagger.errors.forbidden(res);
        }
    }
};
