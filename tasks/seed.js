module.exports = function(grunt) {

    /**
     * FIXME Functionality is duplicated in the API (see routes/admin).
     */
    grunt.registerTask('seedCollections', 'Seed the assets and tutorials from their JSON definitions', function() {

        var _ = require('underscore'),
            mongoose = require('mongoose');

        var AssetModel = require('../server/models/asset-model'),
            TutorialModel = require('../server/models/tutorial-model'),
            config = require('../server/config');

        var assets = [
            require('../server/assets/athlete.json'),
            require('../server/assets/button.json'),
            require('../server/assets/sandpit.json'),
            require('../server/assets/scoreboard.json'),
            require('../server/assets/sun.json')
        ];

        var tutorials = [
            require('../server/tutorials/01-intro.json'),
            require('../server/tutorials/02-objects-and-properties.json'),
            require('../server/tutorials/03-events-and-methods.json'),
            require('../server/tutorials/04-adding-new-objects.json'),
            require('../server/tutorials/05-customising-objects.json'),
            require('../server/tutorials/06-publishing-your-app.json')
        ];


        // async mode
        var done = this.async();

        var connectUri = config.get('MONGOLAB_URI') || config.get('db:mongodbURI');

        console.log('Connecting to: ', connectUri);

        mongoose.connect(connectUri);

        var numSavedAssets = 0,
            numSavedTutorials = 0;

        var finishWhenDone = function() {

            if( numSavedAssets >= assets.length &&
                numSavedTutorials >= tutorials.length ) {

                mongoose.connection.close(function(){
                    done();
                });

            }

        };

        var countAssetSaved = function() {
            numSavedAssets++;
            finishWhenDone();
        };

        var countTutorialSaved = function() {
            numSavedTutorials++;
            finishWhenDone();
        };

        var db = mongoose.connection;

        db.on('error', function(err) {
            console.log(err);
            done();
        });

        db.once('open', function () {

            // Assets
            _(assets).each(function(asset){
                console.log("Asset:", asset.name);

                var dbAsset = new AssetModel(asset);

                dbAsset.save(function(err, savedAsset) {
                    if (err || !savedAsset) {
                        console.log(err);
                    }

                    console.log(savedAsset);

                    countAssetSaved();

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

                    countTutorialSaved();

                });
            });

        });

    });
};




