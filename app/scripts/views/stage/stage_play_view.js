/*jshint camelcase:false*/

/**
 * View for the stage, in play mode.
 */
define([
    'underscore',
    'jquery',
    'backbone',
    'backbone.marionette',
    'easel',
    'views/stage/stage_view',
    'views/stage/entity_collection_view',
    'views/stage/entity_play_view',
    'models/stage_play/proxy_entity_factory',
    'tween',
    'tweenMotionGuidePlugin'
], function(
    _,
    $,
    Backbone,
    Marionette,
    // EaselJS, and some of it's sister libraries tie everything to createjs
    createjs,
    StageView,
    EntityCollectionView,
    EntityPlayView,
    ProxyEntityFactory
) {

    'use strict';

    /**
     * Acts as a super view. Initializes necessary subviews. Manages them where
     * necessary
     */
    var StagePlayView = StageView.extend({

        cachedPropertiesByProxyEntityId: {},

        initialize: function(options) {
            this.constructor.__super__.initialize.apply(this, [options]);
            this.proxyEntityFactory = new ProxyEntityFactory(this.collection);

            createjs.MotionGuidePlugin.install(createjs.Tween);
        },

        onShow: function() {
            this.initializeScene();
            this.initializeTicker();
            this.startScene();
        },

        onClose: function() {
            this.removeSceneEventListeners();
        },

        createEntityCollectionView: function(stage) {

            var entityCollectionView = new EntityCollectionView({
                itemView: EntityPlayView,
                dispatcher: this.dispatcher,
                collection: this.collection,
                stage: stage
            });

            return entityCollectionView;
        },

        startScene: function() {
            // Reset cached properties each time scene is played, otherwise we may have out of date properties
            this.cachedPropertiesByProxyEntityId = {};
            // Listen to all user events (those in the 'sceneEvent' namespace)
            this.addSceneEventListeners();
            // Trigger the first event in the world
            this.triggerFirstSceneEvent();
        },

        addSceneEventListeners: function() {
            this.collection.on('sceneEvent', this.onSceneEvent, this);
        },

        removeSceneEventListeners: function() {
            this.collection.off('sceneEvent', this.onSceneEvent, this);
        },

        triggerFirstSceneEvent: function() {
            this.collection.trigger('sceneEvent', 'myScene', 'onStart');
        },

        onSceneEvent: function(sourceEntityId, eventName) {
            var sourceEntity,
                event,
                eventListeners;

            sourceEntity = this.collection.get( sourceEntityId );
            event = sourceEntity.get('events').findWhere({name: eventName});

            if( event ) {

                eventListeners = event.get('listeners');

                if( eventListeners ) {
                    this.runListeners(sourceEntity, eventListeners);
                }

            }

        },

        runListeners: function(sourceEntity, listeners) {
            listeners.each(function(listener) {
                var entity,
                    entityView,
                    sourceEntityView;

                entity = this.collection.get( listener.get('entity_id') );
                entityView = this.entityCollectionView.findByModel(entity);

                // Get the source model to pass through to the method
                sourceEntityView = this.entityCollectionView.findByModel(sourceEntity);

                this.runEntityMethod(entity, entityView.container, listener.get('method_name'), sourceEntityView);
            }, this);

        },

        runEntityMethod: function(entity, entityViewContainer, methodName, sourceEntityView) {
            var proxyEntity,
                entityMethods,
                entityMethod,
                entityMethodBody,
                propertiesForProxyEntity;

            entityMethods = entity.get('methods');
            entityMethod = entityMethods.findWhere({name: methodName});
            entityMethodBody = entityMethod.get('body');

            proxyEntity = this.proxyEntityFactory.create(entity, entityViewContainer);

            /**
             * We need to cache the properties so we can keep state stored between methods, e.g. to store on the
             * scoreboard whether it's a foul jump. We don't want to store them back on the actual project entities,
             * for security reasons. They should only last while the stage is 'playing'.
             * NB. The reason we don't cache the whole proxy entity right now is because trying to re-use
             * the Tweens is causing problems. Might be good to revisit this though.
             */
            propertiesForProxyEntity = this.cachedPropertiesByProxyEntityId[entity.attributes.id];

            if( propertiesForProxyEntity ) {
                _.each(propertiesForProxyEntity, function(value, key) {
                    proxyEntity.properties[key] = value;
                });
            }

            proxyEntity.run(methodName, entityMethodBody, sourceEntityView);

            // Now cache the properties after the method has been run, in case the method has changed them
            this.cachedPropertiesByProxyEntityId[entity.attributes.id] = proxyEntity.properties;
        }
    });

    return StagePlayView;

});
