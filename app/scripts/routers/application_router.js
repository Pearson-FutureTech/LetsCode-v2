/*global define:true*/

/**
 * Defines the client-side routing, i.e. what to do based on the URL.
 */
define([
    'underscore',
    'backbone.marionette',
    'communicator'
], function(
    _,
    Marionette,
    Communicator
){

    'use strict';

    return Marionette.AppRouter.extend({

        // These strings match up with the methods in the ApplicationController
        appRoutes: {
            'profile/:username': 'profile',
            'profile/:username/email-sent': 'profileEmailSent',
            'tutorials': 'tutorials',
            'projects': 'projects',
            'tutorial/:tid/project/:pid': 'tutorialProject',
            'project/:pid': 'project',
            'help': 'help'
        },

        initialize: function () {

            var state = Communicator.reqres.request('app:state');

            Communicator.mediator.on('user:signup:success', this.goToUserPage, this);
            Communicator.mediator.on('user:signup:email:sent', this.goToUserEmailSentPage, this);

            Communicator.mediator.on('user:signin:success', this.goToTutorialsPage, this);
            Communicator.mediator.on('user:new:start', this.goToTutorialsPage, this);

            Communicator.mediator.on('tutorial:open', this.goToTutorialPage, this);

            Communicator.mediator.on('project:open', this.goToProjectPage, this);
            Communicator.mediator.on('project:close', this.goToTutorialsPage, this);

            Communicator.mediator.on('tutorial:end', function(projectId) {
                // Switch to Project URL, but don't trigger re-render
                this.goToProjectPage(projectId, true);
                state.set('view', 'project');
            }, this);

            Communicator.mediator.on('project:save-as:success', function(projectId, tutorialId) {
                // Update Project ID in URL, whether it's the project URL or tutorial URL
                if( tutorialId ) {
                    this.goToTutorialPage(tutorialId, projectId, true);
                } else {
                    this.goToProjectPage(projectId, true);
                }
            }, this);

            Communicator.mediator.on('user:logout:request', this.goToLogoutPage);

        },

        goToUserPage: function(username) {
            this.navigate('/profile/' + username, { trigger: true });
        },

        goToUserEmailSentPage: function (username) {
            this.navigate('/profile/' + username + '/email-sent', {trigger: true });
        },

        goToTutorialsPage: function() {
            this.navigate('/tutorials', { trigger: true });
        },

        goToTutorialPage: function( tutorialId, projectId, isSilent ) {
            this.navigate('/tutorial/' + tutorialId + '/project/' + projectId, { trigger: !isSilent });
        },

        goToProjectsPage: function() {
            this.navigate('/projects', { trigger: true });
        },

        goToProjectPage: function( projectId, isSilent ) {
            this.navigate('/project/' + projectId, { trigger: !isSilent });
        },

        goToLogoutPage: function () {
            // Using .navigate to avoid hash change
            window.location.href = '/sign_out';
        }

    });

});
