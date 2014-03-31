/*jshint camelcase:false*/

/**
 * Controller for the Stage (the canvas).
 */
define([
    'underscore',
    'jquery',
    'backbone',
    'communicator',
    'backbone.marionette',
    'utils/entity_utils',
    'collections/project/entity_collection',
    'views/stage/stage_edit_view',
    'views/stage/stage_play_view'
], function(
    _,
    $,
    Backbone,
    Communicator,
    Marionette,
    EntityUtils,
    EntityCollection,
    StageEditView,
    StagePlayView
) {

    'use strict';

    var StageController = Marionette.Controller.extend({

        stageTypes: {
            edit: StageEditView,
            play: StagePlayView
        },

        initialize: function() {

            this.project = Communicator.reqres.request('project');

            this.stageRegion = new Marionette.Region({
                el: '#stage'
            });

        },

        start: function() {

            // Make sure we don't duplicate the event listeners
            this.stop();

            // For waiting until the project has been loaded
            this.project.on('sync', this.onProjectReset, this);

            // Refresh the stage when it's been changed
            this.project.on('change:stage', this.onStageChange, this);

            Communicator.mediator.on('entity:updated', this.onStageChange, this);

            Communicator.mediator.on('ide:stage:addEntity', this.addEntity, this);

        },

        stop: function() {

            this.project.off('sync', this.onProjectReset, this);

            this.project.off('change:stage', this.onStageChange, this);

            Communicator.mediator.off('entity:updated', this.onStageChange, this);

            Communicator.mediator.off('ide:stage:addEntity', this.addEntity, this);

        },

        onProjectReset: function() {
            this.ready = true;
        },

        onStageChange: function() {
            if( this.ready ) {
                this.initializeStage('edit');
            }
        },

        showEdit: function() {
            this.initializeSceneWhenReady('edit');
        },

        showPlay: function() {
            this.initializeSceneWhenReady('play');
        },

        // FIXME not very nice to do polling - can we replace with an event listener and a little logic instead?
        initializeSceneWhenReady: function(mode) {
            clearTimeout(this.timer);

            if( this.ready ) {

                if( mode === 'edit' ) {

                    // Now we can finally check if we actually have permission to edit!
                    // FIXME it feels like this should belong somewhere else...

                    var user = Communicator.reqres.request('user'),
                        project = Communicator.reqres.request('project'),
                        allowEdit;

                    // Figure out whether editing is allowed initially

                    allowEdit = user.isLoggedIn() && (user.get('_id') === project.get('author_id'));

                    if( !allowEdit ) {
                        mode = 'play';
                        Communicator.mediator.trigger('ide:mode:play');
                    }

                }

                this.initializeStage(mode);
                return;
            }

            this.interval = setTimeout(function() {
                this.initializeSceneWhenReady(mode);
            }.bind(this), 100);
        },

        initializeStage: function(mode) {
            var viewOptions,
                stage,
                StageView;

            stage = this.project.get('stage');

            viewOptions = {
                collection: stage.get('entities'),
                width: stage.get('width'),
                height: stage.get('height')
            };

            StageView = this.stageTypes[mode];

            this.stageRegion.close();
            this.stageRegion.show(new StageView(viewOptions));

            Communicator.mediator.trigger('project:shown:'+mode);

        },

        addEntity: function(entityToAdd) {

            var stage = this.project.get('stage'),
                newEntity = EntityUtils.deepCloneEntity(entityToAdd),
                entitiesOfSameType;

            // If there is more than one object of this type on the stage, add a suitable number to the end of the ID
            entitiesOfSameType = stage.get('entities').where({name: newEntity.get('name')});

            if( entitiesOfSameType && entitiesOfSameType.length > 0 ) {
                newEntity.setPropertyValue('id', newEntity.get('id') + entitiesOfSameType.length);
            }

            stage.get('entities').add( newEntity );

            this.showEdit();

            // Select the new entity by default
            Communicator.mediator.trigger('entity:selected', newEntity.get('id'));

            // Now that the selectedEntityId value will have updated, trigger re-render of entity select input
            Communicator.mediator.trigger('ide:stage:addedEntity');

        }

    });

    return StageController;

});
