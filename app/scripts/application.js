/*global define:true*/

/**
 * Base Application that either attaches views to existing HTML, or fires up Backbone rendering.
 */
define([
    'backbone.marionette',
    'backbone',
    'communicator',
    'models/state_model',
    'controllers/application_controller',
    'views/layout/application_layout',
    'modules/welcome_module',
    'modules/help_module',
    'modules/user_module',
    'routers/application_router',
    'marionette.handlebars'
], function(
    Marionette,
    Backbone,
    Communicator,
    StateModel,
    ApplicationController,
    ApplicationLayout,
    WelcomeModule,
    HelpModule,
    UserModule,
    ApplicationRouter
) {

    'use strict';

    var Application = new Marionette.Application();

    Application.addRegions({
        main: '#main'
    });

    Application.addInitializer(function() {

        var path = window.location.pathname;

        /**
         * If homepage or help page, attach view to existing HTML (served by server - see index.ejs and home.ejs).
         * Otherwise, render client-side (main div will be empty - see app.ejs).
         */
        if( path === '/' ) {
            this.welcomePage();
        } else if( path === '/help' ) {
            this.helpPage();
        } else {
            this.startApplication();
        }
    });

    // HTML served by the server (index.ejs)
    Application.welcomePage = function() {

        UserModule.start();

        // Auto-proceed to Tutorials page if we're already logged in
        Communicator.reqres.request('user:refresh_is_user_logged_in', function(isLoggedIn) {
            if( isLoggedIn ) {
                window.location.href = '/tutorials';
            } else {
                WelcomeModule.start();
            }
        });

    };

    // HTML served by the server (help.ejs)
    Application.helpPage = function() {

        HelpModule.start();

    };

    Application.startApplication = function() {

        var stateModel = new StateModel();

        Application.main.show(new ApplicationLayout());

        Application.controller = new ApplicationController({
            state: stateModel
        });

        Application.router = new ApplicationRouter({
            controller: Application.controller
        });

        Backbone.history.start({pushState: true});

    };

    return Application;

});
