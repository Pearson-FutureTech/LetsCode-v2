module.exports = function(grunt) {

    /**
     * FIXME Functionality is duplicated in the API (see routes/admin).
     */
    grunt.registerTask('dropSeedableCollections', 'Drop the data we can re-seed from JSON, i.e. assets and tutorials', function() {

        var mongoose = require('mongoose');
        var config = require('../server/config');

        // async mode
        var done = this.async();

        var connectUri = config.get('MONGOLAB_URI') || config.get('db:mongodbURI');

        console.log('Connecting to: ', connectUri);
        
        var db = mongoose.createConnection(connectUri);

        db.on('error', function(err) {
            console.log(err);

            db.close(function(){
                done();
            });
        });

        db.once('open', function() {

            // NB. To drop the whole database (for development only): mongoose.connection.db.dropDatabase

            db.collection('assets').drop(function(errAssets) {
                if( errAssets ) {
                    console.log( errAssets );
                } else {
                    console.log( 'Dropped assets' );
                }

                db.collection('tutorials').drop(function(errTutorials) {
                    if( errTutorials ) {
                        console.log( errTutorials );
                    } else {
                        console.log( 'Dropped tutorials' );
                    }

                    db.close(function(){
                        console.log( 'Successfully dropped collections' );
                        done();
                    });
                });

            });
        });
    });
};





