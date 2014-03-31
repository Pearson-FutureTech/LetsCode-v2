/**
 * Remember to make the same changes to tasks/seed.js so that this can also be done on the command line,
 * using `grunt seed`.
 */
'use strict';

var _ = require('underscore'),
    Mongoose = require('mongoose');

var config = require('../config'),
    AssetModel = require('../models/asset-model'),
    TutorialModel = require('../models/tutorial-model');

// These are the ones that will be made available in the Object Library
var assets = [
    require('../assets/athlete.json'),
    require('../assets/button.json'),
    require('../assets/sandpit.json'),
    require('../assets/scoreboard.json'),
    require('../assets/sun.json')
];

var tutorials = [
    require('../tutorials/01-intro.json'),
    require('../tutorials/02-objects-and-properties.json'),
    require('../tutorials/03-events-and-methods.json'),
    require('../tutorials/04-adding-new-objects.json'),
    require('../tutorials/05-customising-objects.json'),
    require('../tutorials/06-publishing-your-app.json')
];

// Simple authentication for now - just uses u/n and p/w defined in environment variables
function isAdmin(username, password) {
    var u = config.get('LETS_CODE_ADMIN_USERNAME');
    var p = config.get('LETS_CODE_ADMIN_PASSWORD');

    return u && p && username === u && password === p;
}


/**
 * Drop the collections from the database that we can re-seed from JSON
 */
exports.dropSeedableCollections = {
    'spec': {
        'description': 'Drop the asset and tutorial collections from the database',
        'path': '/admin/drop_database',
        'notes': 'Keeps project and user collections',
        'summary': 'Drops the assets and tutorials',
        'method': 'GET',
        'params': [],
        'errorResponses': [],
        'nickname': 'dropSeedableCollections'
    },

    'action': function (req, res) {

        if (isAdmin(req.body.username, req.body.password)) {

            console.log('Dropping asset and tutorial collections');

            Mongoose.connection.db.collection('assets').drop(function(errAssets) {
                if( errAssets ) {
                    console.log( errAssets );
                    return res.json({
                        message: 'Failure'
                    });
                } else {
                    console.log( 'Dropped assets' );
                }

                Mongoose.connection.db.collection('tutorials').drop(function(errTutorials) {
                    if( errTutorials ) {
                        console.log( errTutorials );
                        return res.json({
                            message: 'Failure'
                        });
                    } else {
                        console.log( 'Dropped tutorials' );
                    }

                    return res.json({
                        message: 'Success'
                    });
                });

            });

        } else {
            return res.json(403);
        }
    }
};


/**
 * Seeds the assets and tutorials from their JSON definitions
 */
exports.seedCollections = {
    'spec': {
        'description': 'Seed the assets and tutorials into the database',
        'path': '/admin/seed_database',
        'notes': 'Inserts into the database from JSON definitions',
        'summary': 'Seeds the assets and tutorials',
        'method': 'GET',
        'params': [],
        'errorResponses': [],
        'nickname': 'seedCollections'
    },

    'action': function (req, res) {

        /* NB. Assets and Tutorials are seeded. Users and Projects are created by using the app. */
        if (isAdmin(req.body.username, req.body.password)) {
            console.log('Seeding Database');

            // Assets
            _(assets).each(function(asset) {
                console.log('Saving Asset:', asset.name);

                var dbAsset = new AssetModel(asset);

                dbAsset.save(function(err, savedAsset) {
                    if( err || !savedAsset ) {
                        console.log(err);
                    }
                    console.log(savedAsset);
                });

            });

            // Tutorials
            _(tutorials).each(function(tutorial) {
                console.log('Saving Tutorial:', tutorial.name);

                var dbAsset = new TutorialModel(tutorial);

                dbAsset.save(function(err, savedTutorial) {
                    if( err || !savedTutorial ) {
                        console.log(err);
                    }
                    console.log(savedTutorial);
                });
            });

            return res.json({
                message: 'Success'
            });

        } else {
            return res.json(403);
        }
    }
};
