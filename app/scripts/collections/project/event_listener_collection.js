/**
 * Collection for within events, to specify event listeners, i.e. which methods to trigger when the event happens.
 */
define([
    'backbone',
    'models/project/event_listener_model'
], function(
    Backbone,
    EventListenerModel
) {

    'use strict';

    return Backbone.Collection.extend({

        model: EventListenerModel

    });

});