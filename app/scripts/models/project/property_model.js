/*jshint camelcase:false*/

/**
 * Model definition for properties defined as part of an entity.
 */
define([
    'backbone'
], function(
    Backbone
) {

    'use strict';

    return Backbone.Model.extend({

        defaults: {

            type: null,
            name: null,
            value: null,
            comment: null,
            read_only: false,
            hidden: false

        }

    });

});
