/*global define:true*/

/**
 * Entry-point controller for the app. Handles the routes defined in the AppRouter.
 */
define([
    'backbone.marionette',
    'communicator',
    'modules/user_module',
    'modules/asset_module',
    'modules/header_module',
    'modules/profile_module',
    'modules/profile_email_sent_module',
    'modules/tutorials_module',
    'modules/tutorial_module',
    'modules/projects_module',
    'modules/project_module',
    'modules/ide_module',
    'modules/help_module'
], function(
    Marionette,
    Communicator,
    UserModule,
    AssetModule,
    HeaderModule,
    ProfileModule,
    ProfileEmailSentModule,
    TutorialsModule,
    TutorialModule,
    ProjectsModule,
    ProjectModule,
    IdeModule,
    HelpModule
) {

    'use strict';

    /**
     * TODO I think we should refactor the modules to use Application.module instead of be separate Applications
     * (also using Controllers for each one). Application.module is the pattern shown in e.g.
     * "Structuring Backbone with Require.js and Marionette". And it means we'd be able to stop and start them.
     * Need to figure out the circular dependency thing though...
     */
    return Marionette.Controller.extend({

        initialize: function(options) {
            var state = options.state,
                user;

            Communicator.reqres.setHandler('app:state', function() {
                return state;
            });

            UserModule.start();
            ProjectModule.start();
            AssetModule.start();
            IdeModule.start();
            TutorialsModule.start();

            user = Communicator.reqres.request('user');

            user.on('change:username', function() {
                state.set('username', user.get('username'));
            });
        },

        // Initialisation to do for every route
        all: function() {

            HeaderModule.start();

            // Important to close any existing tutorial because otherwise the bubbles would show up above the over view
            TutorialModule.close();

            // Make sure we close the IDE module, which will in turn close the selectedEntityView
            IdeModule.close();

        },

        profile: function(username) {
            var self = this;

            Communicator.reqres.request('user:refresh_is_user_logged_in', function(isLoggedIn) {
                var user,
                    state;

                self.all();

                if (isLoggedIn) {
                    state = Communicator.reqres.request('app:state');
                    user = Communicator.reqres.request('user');

                    ProfileModule.start();

                    state.set('view', 'profile');

                    Communicator.mediator.trigger('profile:route:loaded', username);
                } else {
                    Communicator.mediator.trigger('user:logout:request');
                }

            });
        },

        profileEmailSent: function(username) {
            var self = this;

            Communicator.reqres.request('user:refresh_is_user_logged_in', function(isLoggedIn) {
                var user,
                    state;

                self.all();

                if (isLoggedIn) {
                    state = Communicator.reqres.request('app:state');
                    user = Communicator.reqres.request('user');

                    ProfileEmailSentModule.start();

                    state.set('view', 'profile');

                    Communicator.mediator.trigger('profile:route:loaded', username);
                } else {
                    Communicator.mediator.trigger('user:logout:request');
                }

            });
        },


        tutorials: function(username) {
            var self = this;

            Communicator.reqres.request('user:refresh_is_user_logged_in', function(isLoggedIn) {
                var user,
                    state;

                self.all();

                if (isLoggedIn) {
                    state = Communicator.reqres.request('app:state');
                    user = Communicator.reqres.request('user');

                    // NB. The TutorialsModule is already started (so that we load the tutorials down as soon as poss.)
                    TutorialsModule.showTutorials();
                    state.set('view', 'tutorials');

                    Communicator.mediator.trigger('tutorials:route:loaded', username);
                } else {
                    Communicator.mediator.trigger('user:logout:request');
                }

            });
        },

        // Display a particular tutorial project
        tutorialProject: function(tutorialId, projectId) {
            var self = this;

            Communicator.reqres.request('user:refresh_is_user_logged_in', function() {
                var state;

                self.all();
                state = Communicator.reqres.request('app:state');

                TutorialModule.start();

                IdeModule.show();

                // TODO refactor to call show() with no args and pick up tutorial same way as it picks up the project?
                TutorialModule.show(tutorialId);

                state.set('view', 'tutorialProject');
                state.set('tutorialId', tutorialId);
                state.set('projectId', projectId);

                Communicator.mediator.trigger('project:route:loaded', projectId);

            });
        },

        // Display the user's list of projects
        projects: function() {
            var self = this;

            Communicator.reqres.request('user:refresh_is_user_logged_in', function(isLoggedIn) {
                var user,
                    state;

                self.all();

                if (isLoggedIn) {
                    state = Communicator.reqres.request('app:state');
                    user = Communicator.reqres.request('user');

                    ProjectsModule.start();
                    ProjectsModule.show();
                    state.set('view', 'projects');

                    Communicator.mediator.trigger('projects:route:loaded');
                } else {
                    Communicator.mediator.trigger('user:logout:request');
                }

            });
        },

        // Display a particular project
        project: function(projectId) {
            var self = this;

            Communicator.reqres.request('user:refresh_is_user_logged_in', function() {
                var state;

                self.all();
                state = Communicator.reqres.request('app:state');

                IdeModule.show();

                state.set('view', 'project');
                state.set('projectId', projectId);

                Communicator.mediator.trigger('project:route:loaded', projectId);

            });
        },

        help: function() {

            this.all();

            HelpModule.start();

        }

    });

});
