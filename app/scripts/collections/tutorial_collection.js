/*jshint camelcase:false*/

/**
 * Collection of the available tutorials.
 */
define([
    'underscore',
    'backbone',
    'models/tutorial_model'
], function(
    _,
    Backbone,
    TutorialModel
    ) {

    'use strict';

    return Backbone.Collection.extend({

        model: TutorialModel,
        url: '/api/tutorials',

        parse: function( res ) {
            return res.data;
        }

    });

});
