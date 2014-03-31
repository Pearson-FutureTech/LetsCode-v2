/**
 * Collection for an entity's named events that can have listeners defined to execute methods.
 */
define([
    'underscore',
    'backbone',
    'models/project/event_model'
], function(
    _,
    Backbone,
    EventModel
) {

    'use strict';

    return Backbone.Collection.extend({

        model: EventModel

    });

});