/*global define:true*/

/**
 * For the Help page.
 */
define([
    'backbone.marionette',
    'views/help_view'
], function(
    Marionette,
    HelpView
    ) {

    'use strict';

    var HelpModule = new Marionette.Application();

    HelpModule.addInitializer(function() {

        var view = new HelpView();

        HelpModule.addRegions({
            content: '#content'
        });

        HelpModule.content.attachView( view );

    });

    return HelpModule;

});
