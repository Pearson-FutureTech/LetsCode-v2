/*jshint camelcase:false*/

/**
 * Model definition for methods defined as part of entities, i.e. pieces of runnable code.
 */
define([
    'backbone'
], function(
    Backbone
) {

    'use strict';

    return Backbone.Model.extend({

        defaults: {

            name: null,
            body: null,
            comment: null,
            read_only: false,
            hidden: false

        }

    });

});
