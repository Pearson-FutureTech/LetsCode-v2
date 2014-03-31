/*jshint camelcase:false*/

/**
 * For each entity on the stage, in edit mode.
 */
define([
    'underscore',
    'jquery',
    'easel',
    'backbone.marionette',
    'communicator',
    'views/stage/entity_view'
], function(
    _,
    $,
    createjs,
    Marionette,
    Communicator,
    EntityView
) {

    'use strict';

    return EntityView.extend({

        initialize: function(options) {
            this.constructor.__super__.initialize.apply(this, [options]);
            this.addMoveListeners();
            this.addInteractionListeners();
        },


        addInteractionListeners: function() {
            var me = this;

            // Click detection
            this.container.on('click', function(e) {
                e.preventDefault();
                Communicator.mediator.trigger( 'entity:selected', me.model.get('id') );
            });
        },


        addMoveListeners: function() {

            this.isDraggable = function(entityModel) {
                return entityModel.get('name') !== 'Scene';
            };


            // Called on each mouse down, updates offset
            this.container.on('mousedown', function(event) {
                if ( !this.isDraggable(this.model) ) {
                    return;
                }

                /// Record or current position
                this.previousPosition = {
                    x: this.container.x,
                    y: this.container.y
                };

                // Record our mouse offset
                this.offset = {
                    x: this.container.x - event.stageX,
                    y: this.container.y - event.stageY
                };

                Communicator.mediator.trigger( 'entity:drag-start', this.model.get('id') );
            }, this);


            // Called after the drag has finished. Updates the model with a new offset.
            this.container.on('pressup', function(event) {
                if ( !this.isDraggable(this.model) ) {
                    return;
                }

                var x = event.stageX + this.offset.x,
                    y = event.stageY + this.offset.y,
                    xChange = x - this.previousPosition.x,
                    yChange = y - this.previousPosition.y;

                if( xChange !== 0 || yChange !== 0 ) {

                    var entityId = this.model.get('id');

                    this.model.setPropertyValue('left', x);
                    this.model.setPropertyValue('top', y);

                    // TODO see if we can replace this with default Backbone change event
                    Communicator.mediator.trigger( 'entity:updated', entityId );

                }

            }, this);


            // Called periodically as we drag (after `mousedown`). Updates the selected bounding box position.
            this.container.on('pressmove', function(event) {
                if ( !this.isDraggable(this.model) ) {
                    return;
                }

                this.container.x = event.stageX + this.offset.x;
                this.container.y = event.stageY + this.offset.y;

            }, this);

        }

    });
});
