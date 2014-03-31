/*jshint camelcase:false*/

/**
 * For each entity on the stage, in play mode.
 */
define([
    'underscore',
    'easel',
    'backbone.marionette',
    'views/stage/entity_view'
], function(
    _,
    createjs,
    Marionette,
    EntityView
) {

    'use strict';

    return EntityView.extend({

        initialize: function(options) {
            this.constructor.__super__.initialize.apply(this, [options]);
            this.addInteractionListeners();
        },

        addInteractionListeners: function() {

            var me = this,
                modelEvents = this.model.get('events');

            if( modelEvents.findWhere({name: 'onClick'}) ) {

                this.container.on('click', function(e) {
                    e.preventDefault();
                    // Trigger 'onClick' entity event if there is one
                    me.model.trigger('sceneEvent', me.model.id, 'onClick');
                });

            }

            if( modelEvents.findWhere({name: 'onHover'}) ) {

                this.container.on('mouseover', function(e) {
                    e.preventDefault();
                    // Trigger 'onHover' entity event if there is one
                    me.model.trigger('sceneEvent', me.model.id, 'onHover');
                });

            }

        }

    });
});
