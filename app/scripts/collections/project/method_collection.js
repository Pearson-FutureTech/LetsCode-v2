/**
 * Collection for entity methods, i.e. the pieces of code that they can execute, e.g. 'longJump' method for athlete.
 */
define([
    'underscore',
    'backbone',
    'models/project/method_model'
], function(
    _,
    Backbone,
    MethodModel
) {

    'use strict';

    return Backbone.Collection.extend({

        model: MethodModel

    });

});