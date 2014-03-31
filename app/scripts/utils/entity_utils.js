/*jshint camelcase:false*/

define([
    'underscore',
    'jquery',
    'communicator',
    'collections/project/method_collection',
    'collections/project/property_collection',
    'collections/project/event_collection',
    'collections/project/event_listener_collection'
], function(
    _,
    $,
    Communicator,
    MethodCollection,
    PropertyCollection,
    EventCollection,
    EventListenerCollection
) {

    'use strict';

    var EntityUtils = {

        getEntityPositionProps: function(entityId) {

            var $stageEl = $('#stage-canvas'),
                entities = Communicator.reqres.request('entities'),
                entity = entities.get(entityId);

            if( entity ) {

                return {
                    left: entity.getPropertyValue('left') + $stageEl.offset().left,
                    top: entity.getPropertyValue('top') + $stageEl.offset().top,
                    width: entity.getPropertyValue('width'),
                    height: entity.getPropertyValue('height')
                };

            }

            return null;

        },

        deepCloneEntity: function(entity) {

            var newEntity = entity.clone(),
                newMethods = new MethodCollection(),
                newProperties = new PropertyCollection(),
                newEvents = new EventCollection();

            // Now we need to go through and clone the models in the sub-collections.
            // Otherwise we would overwrite them on the asset model

            newEntity.get('methods').each(function(method) {
                newMethods.add( method.clone() );
            });

            newEntity.get('properties').each(function(property) {
                newProperties.add( property.clone() );
            });

            newEntity.get('events').each(function(event) {

                var newEvent = event.clone(),
                    newListeners = new EventListenerCollection();

                newEvent.get('listeners').each(function(listener) {
                    newListeners.add( listener.clone() );
                });

                newEvent.set({listeners: newListeners}, {silent: true});

                newEvents.add( newEvent );
            });

            newEntity.set({methods: newMethods, properties: newProperties, events: newEvents}, {silent: true});

            return newEntity;

        }

    };

    return EntityUtils;

});