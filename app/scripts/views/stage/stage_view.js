/**
 * 'Base class' (or 'super view') for StageEditView and StagePlayView. Initializes the necessary subviews.
 */
define([
    'jquery',
    'backbone',
    'backbone.marionette',
    'easel',
    'communicator',
    'utils/create_stage',
    'views/stage/entity_collection_view',
    'views/stage/entity_play_view'
], function(
    $,
    Backbone,
    Marionette,
    // EaselJS, and some of it's sister libraries tie everything to createjs
    createjs,
    Communicator,
    createStage,
    EntityCollectionView,
    EntityPlayView
) {

    'use strict';

    var StageView = Marionette.View.extend({

        initialize: function(options) {
            this.width = options.width;
            this.height = options.height;

            $('.row.stage').on('scroll', function() {
                Communicator.mediator.trigger('stage:scrolled');
            });
        },

        initializeScene: function() {
            var stage,
                width = this.width,
                height = this.height;

            this.stage = stage = createStage({
                width: width,
                height: height,
                id: 'stage-canvas',
                class: 'stage-canvas'
            });

            this.entityCollectionView = this.createEntityCollectionView(stage);

            this.$el.append(this.stage.canvas);
        },

        createEntityCollectionView: function(stage) {
            return new EntityCollectionView({
                itemView: EntityPlayView,
                dispatcher: this.dispatcher,
                collection: this.collection,
                stage: stage
            });
        },

        initializeTicker: function() {
            createjs.Ticker.setFPS(40);
            createjs.Ticker.addEventListener('tick', this.handleTick.bind(this));
        },

        handleTick: function() {
            this.stage.update();
        },

        onShow: function() {
            this.initializeScene();
            this.initializeTicker();
        }

    });

    return StageView;

});
