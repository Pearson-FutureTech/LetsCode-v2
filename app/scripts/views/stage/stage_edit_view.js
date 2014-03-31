/*jshint camelcase:false*/

/**
 * View for the stage, in edit mode.
 */
define([
    'jquery',
    'backbone',
    'backbone.marionette',
    'easel',
    'views/stage/stage_view',
    'views/stage/entity_collection_view',
    'views/stage/entity_edit_view'
], function(
    $,
    Backbone,
    Marionette,
    // EaselJS, and some of it's sister libraries tie everything to createjs
    createjs,
    StageView,
    EntityCollectionView,
    EntityEditView
) {

    'use strict';

    /**
     * Acts as a super view. Initializes necessary subviews. Manages them where
     * necessary
     */
    var StageEditView = StageView.extend({

        initialize: function(options) {
            this.constructor.__super__.initialize.apply(this, [options]);
        },

        createEntityCollectionView: function(stage) {
            return new EntityCollectionView({
                itemView: EntityEditView,
                dispatcher: this.dispatcher,
                collection: this.collection,
                stage: stage
            });
        }

    });

    return StageEditView;

});
