/*jshint camelcase:false*/

/**
 * Contains the off-the-shelf entities that make up the "asset library", or "object library".
 */
define([
    'underscore',
    'backbone',
    'models/project/entity_model'
], function(
    _,
    Backbone,
    EntityModel
) {

    'use strict';

    return Backbone.Collection.extend({

        model: EntityModel,
        url: '/api/assets',

        parse: function( res ) {
            return res.data;
        }

    });

});
