/*jshint camelcase:false*/
/*global define:true*/

/**
 * For individual projects.
 */
define([
    'underscore',
    'backbone.marionette',
    'communicator',
    'models/project/project_model',
    'jquery'
], function(
    _,
    Marionette,
    Communicator,
    ProjectModel,
    $
) {

    'use strict';

    var AUTO_SAVE_TIMEOUT_MILLIS = 2 * 60 * 1000, // Every 2 mins
        ProjectModule = new Marionette.Application();

    ProjectModule.addInitializer(function () {

        _.bindAll(
            this,
            'saveProject'
        );

        this.project = new ProjectModel();

        Communicator.mediator.on('project:shown:edit', this.onProjectShownEdit, this);
        Communicator.mediator.on('project:shown:play', this.onProjectShownPlay, this);
        Communicator.mediator.on('project:close', this.onCloseProject, this);
        Communicator.mediator.on('tutorial:end', this.onTutorialEnd, this);
        Communicator.mediator.on('project:route:loaded', this.loadProject, this);
        Communicator.mediator.on('project:delete', this.deleteProject, this);

        Communicator.reqres.setHandler('project', function() {
            return this.project;
        }, this);

        Communicator.reqres.setHandler('entities', function() {
            var stage = this.project.get('stage');
            return stage ? stage.get('entities') : null;
        }, this);

    });

    /**
     * Edit mode enables auto-save, if we're not in a tutorial.
     */
    ProjectModule.onProjectShownEdit = function() {

        var state = Communicator.reqres.request('app:state');

        if( state.get('view') === 'project' ) {
            this.enableAutoSave();
        }

    };

    /**
     * Play mode triggers project save, if we're not in a tutorial. Also disables auto-save.
     */
    ProjectModule.onProjectShownPlay = function() {

        var state = Communicator.reqres.request('app:state');

        if( state.get('view') === 'project' ) {
            this.saveProject();
        }

        // Disable auto-save (should only be while editing non-tutorial projects)
        this.disableAutoSave();

    };

    /**
     * Closing the project also triggers save, if we're not in a tutorial, or if we've completed it.
     * Then disable auto-save.
     */
    ProjectModule.onCloseProject = function( tutorialIsCompleted ) {

        var state = Communicator.reqres.request('app:state');

        if( state.get('view') === 'project' || tutorialIsCompleted ) {
            this.saveProject();
        }
        // Else, delete the project? We could do that to clear up tutorial projects that the user won't need anymore.
        // But then what about if the user clicks the back button? Then we'd need to create a new project again...

        this.disableAutoSave();

    };

    /**
     * For when the user ends the tutorial, but continues with the project. Now we want to enable auto-save if we're
     * in edit mode.
     */
    ProjectModule.onTutorialEnd = function() {

        // FIXME this is a quick cheat for determining if we're in edit mode or not.
        // Should replace with a state attribute that we update when we change mode (or something else).
        var mode = $('#btn-edit').hasClass('inactive') ? 'play' : 'edit';

        if( mode === 'edit' ) {

            this.enableAutoSave();

        }

    };

    ProjectModule.loadProject = function( projectId ) {

        // Should we check here if this project is already loaded? (By comparing projectId?)
        this.project.set('id', projectId);
        var jqXHR = this.project.fetch({reset: true});

        // Can we just use the model sync/reset event instead of our custom project:loaded event?
        jqXHR.done(function() {
            Communicator.mediator.trigger('project:loaded');
        });

        jqXHR.fail(function() {
            Communicator.mediator.trigger('project:load:failed');
        });

    };

    ProjectModule.setProject = function( project ) {

        var state = Communicator.reqres.request('app:state'),
            tutorialId,
            newProjectId = project.get('_id');

        this.project.set( project.attributes );
        this.project.set( {id: newProjectId} );

        state.set('projectId', newProjectId );

        if( state.get('view') === 'tutorialProject' ) {
            tutorialId = state.get('tutorialId');
        }

        // Triggers URL update to reflect the new project ID
        Communicator.mediator.trigger('project:save-as:success', newProjectId, tutorialId);

    };

    ProjectModule.saveProject = function() {

        if( this.project ) {
            this.project.save(null, {patch: true, silent: true});
        }

    };

    ProjectModule.deleteProject = function( projectId ) {

        var deleteProjectId = projectId;

        if( !deleteProjectId && this.project ) {
            deleteProjectId = this.project.get('id');
        }

        if( deleteProjectId ) {

            // Use Backbone implicit AJAX via Model.destroy()? But we don't want to have to load the project model first
            $.ajax({
                url: '/api/projects/'+deleteProjectId,
                type: 'DELETE',
                success: function() {
                    Communicator.mediator.trigger('project:deleted', deleteProjectId);
                }
            });

        }

    };

    ProjectModule.enableAutoSave = function() {
        /* global console */

        // Make sure we don't set up more than one interval
        this.disableAutoSave();

        console.log('Enable auto save');

        // TODO later: check if any changes have been actually made before saving to server
        this.autoSaveIntervalId = setInterval(this.saveProject, AUTO_SAVE_TIMEOUT_MILLIS);

    };

    ProjectModule.disableAutoSave = function() {
        /* global console */

        if( this.autoSaveIntervalId ) {

            console.log('Disable auto save');

            clearInterval( this.autoSaveIntervalId );

            this.autoSaveIntervalId = null;

        }

    };

    return ProjectModule;

});
