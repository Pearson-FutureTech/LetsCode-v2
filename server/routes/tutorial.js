'use strict';

var swagger = require('swagger-node-express');

var TutorialModel = require('../models/tutorial-model');

/**
 * Get the list of tutorials, sorted by tutorial number
 * TODO Handle multiple levels of tutorials (probably change this to return tutorials for a specific level only).
 */
exports.getTutorials = {
    'spec': {
        'description': 'Get tutorials',
        'path': '/tutorials',
        'notes': 'Returns an array of tutorials',
        'summary': 'Get tutorials',
        'method': 'GET',
        'params': [],
        'responseClass': 'Tutorial',
        'errorResponses': [],
        'nickname': 'getTutorials'
    },
    'action': function (req, res) {
        console.log('Get tutorials', req.params);

        TutorialModel.find({}).sort({number: 1}).execFind(function (err, tutorials) {
            if (err) {
                console.log(err);
                return swagger.stopWithError(res);
            }

            return res.json({
                message: 'Success',
                data: tutorials
            });
        });
    }
};
