/**
 * Model for named events defined as part of entities (e.g. the 'onRunEnd' event for an athlete object).
 */
define([
    'backbone',
    'models/base_nestable_model',
    'collections/project/event_listener_collection'
], function(
    Backbone,
    BaseNestableModel,
    EventListenerCollection
) {

    'use strict';

    return BaseNestableModel.extend({

        defaults: {

            name: null,
            listeners: new EventListenerCollection()

        },

        nestedModels: {
            'listeners': EventListenerCollection
        }

    });

});
