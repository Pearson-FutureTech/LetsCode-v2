/*global define:true*/
/*jshint camelcase:false*/
/*jshint loopfunc:true*/

/**
 * For the Tutorials list page.
 */
define([
    'jquery',
    'underscore',
    'backbone.marionette',
    'views/tutorials_view',
    'collections/tutorial_collection',
    'communicator'
], function (
    $,
    _,
    Marionette,
    TutorialsView,
    TutorialCollection,
    Communicator
) {

    'use strict';

    var TutorialsModule = new Marionette.Application();

    TutorialsModule.addInitializer(function () {

        var self = this;

        TutorialsModule.addRegions({
            content: '#content'
        });

        this.project = Communicator.reqres.request('project');
        this.tutorialCollection = new TutorialCollection();

        Communicator.command.setHandler('tutorials:fetch', function () {
            self.getOrFetchTutorials(function() {
                Communicator.mediator.trigger('tutorials:fetched', self.tutorialCollection);
            });
        });

    });

    TutorialsModule.showTutorials = function() {

        var self = this,
            user = Communicator.reqres.request('user'),
            callback;

        callback = function() {
            self.tutorialsView = new TutorialsView({ model: {user: user, tutorials: self.tutorialCollection} });
            TutorialsModule.content.show( self.tutorialsView );
        };

        self.getOrFetchTutorials( callback );

    };

    TutorialsModule.getOrFetchTutorials = function(callback) {

        if( this.tutorialCollection.length > 0 ) {

            if( callback ) {
                callback();
            }

        } else {

            this.tutorialCollection.fetch({success: function() {
                if( callback ) {
                    callback();
                }
            }});

        }

    };

    return TutorialsModule;

});
