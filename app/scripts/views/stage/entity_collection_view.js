/**
 * Renders the actual objects on the stage.
 */
define([
    'underscore',
    'backbone.marionette'
], function(
    _,
    Marionette
) {
    'use strict';

    return Marionette.View.extend({

        initialize: function(options) {
            this.itemView = options.itemView;
            this.dispatcher = options.dispatcher;
            this.stage = options.stage;
            // Contains an indexed list of EntityView instances
            this.entityViews = {};
            this.render();
        },

        resetEntities: function() {
            _.each(this.entityViews, function(entityView) {
                entityView.close();
                entityView = null;
            });

            this.entityViews = {};
        },

        findByModel: function(model) {
            return this.entityViews[model.get('id')];
        },

        renderEntities: function() {
            this.collection.each(this.renderEntity, this);
        },

        render: function() {
            this.resetEntities();
            this.renderEntities();
        },

        renderEntity: function(entity) {

            var entityView = new this.itemView({
                dispatcher: this.dispatcher,
                model: entity,
                stage: this.stage
            });

            this.entityViews[entity.get('id')] = entityView;
        }

    });
});
