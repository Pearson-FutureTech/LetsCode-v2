/**
 * Collection for entity properties, i.e. their key value pairs.
 */
define([
    'underscore',
    'backbone',
    'models/project/property_model'
], function(
    _,
    Backbone,
    PropertyModel
) {

    'use strict';

    return Backbone.Collection.extend({

        model: PropertyModel

    });

});