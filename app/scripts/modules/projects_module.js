/*jshint camelcase:false*/
/*global define:true*/

/**
 * For the page where we list the user's projects.
 */
define([
    'backbone.marionette',
    'communicator',
    'views/projects_view'
], function(
    Marionette,
    Communicator,
    ProjectsView
    ) {

    'use strict';

    var ProjectsModule = new Marionette.Application();

    ProjectsModule.addInitializer(function() {

        ProjectsModule.addRegions({
            content: '#content'
        });

    });

    ProjectsModule.show = function() {

        // Projects are part of the user
        var user = Communicator.reqres.request('user');

        this.projectsView = new ProjectsView({ model: {user: user} });

        ProjectsModule.content.show( this.projectsView );

    };

    return ProjectsModule;

});
