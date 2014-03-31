/*global define:true*/

/**
 * Layout for the IDE (Integrated Developer Environment), i.e. the stage and edit panel.
 */
define([
    'jquery',
    'backbone.marionette',
    'communicator',
    'controllers/editor_controller',
    'controllers/stage_controller',
    'views/editor/selected_entity_view',
    'hbs!tmpl/layout/ide_template'
], function(
    $,
    Marionette,
    Communicator,
    EditorController,
    StageController,
    SelectedEntityView,
    ideTemplate
    ) {

    'use strict';

    return Marionette.Layout.extend({

        template: {
            type: 'handlebars',
            template: ideTemplate
        },

        regions: {
            stage: '#stage',
            editor: '#editor',
            selectedEntity: '#selected-entity'
        },

        ui: {
            noProjectPopup: '#popup-no-project'
        },

        initialize: function() {

            this.stageController = new StageController();
            this.editorController = new EditorController();

        },

        onShow: function() {

            Communicator.mediator.on('entity:selected', this.onEntitySelected, this);
            Communicator.mediator.on('entity:drag-start', this.closeSelectedEntity, this);
            Communicator.mediator.on('ide:mode:play', this.closeSelectedEntity, this);
            Communicator.mediator.on('ide:mode:edit', this.showEdit, this );
            Communicator.mediator.on('ide:mode:play', this.showPlay, this );
            Communicator.mediator.on('project:load:failed', this.onProjectLoadFailed, this);

            // We need to add a top-level class, to be able to change basic things like background colour
            $('#main').addClass('project');

            this.stageController.start();

            // Edit is the default...
            this.showEdit();

        },

        onClose: function() {

            this.closeSelectedEntity();

            Communicator.mediator.off('entity:selected', this.onEntitySelected, this);
            Communicator.mediator.off('entity:drag-start', this.closeSelectedEntity, this);
            Communicator.mediator.off('ide:mode:play', this.closeSelectedEntity, this);
            Communicator.mediator.off('ide:mode:edit', this.showEdit, this );
            Communicator.mediator.off('ide:mode:play', this.showPlay, this );
            Communicator.mediator.off('project:load:failed', this.onProjectLoadFailed, this);

            this.stageController.stop();

        },

        showEdit: function() {
            this.stageController.showEdit();
            this.editorController.show();
        },

        showPlay: function() {
            this.stageController.showPlay();
            this.editorController.hide();
        },

        onEntitySelected: function(entityId) {

            var project = Communicator.reqres.request('project'),
                entityCollection = project.get('stage').get('entities'),
                entityModel = entityCollection.get(entityId);

            this.closeSelectedEntity();

            if( entityId !== 'Scene' ) {

                this.selectedEntityView = new SelectedEntityView({
                    model: entityModel
                });

                this.selectedEntity.show( this.selectedEntityView );
            }

        },

        closeSelectedEntity: function() {

            if( this.selectedEntity ) {
                this.selectedEntity.close();
            }

            if( this.selectedEntityView ) {
                this.selectedEntityView = null;
            }
        },

        onProjectLoadFailed: function() {
            this.ui.noProjectPopup.show();
        }

    });

});