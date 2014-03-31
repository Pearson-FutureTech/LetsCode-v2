/*jshint camelcase:false*/

/**
 * Model for event listeners that are part of entity events.
 */
define([
    'backbone'
], function(
    Backbone
) {

    'use strict';

    return Backbone.Model.extend({

        defaults: {

            method_name: null,
            entity_id: null

        }

    });

});
