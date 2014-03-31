/**
 * Collection for entities, i.e. objects like the Athlete, the Scoreboard, etc.
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
        model: EntityModel
    });

});
