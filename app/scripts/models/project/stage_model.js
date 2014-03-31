/*jshint camelcase:false*/

/**
 * Model definition for the key part of a project: the stage, containing a collection of entities.
 */
define([
    'backbone',
    'models/base_nestable_model',
    'collections/project/entity_collection'
], function(
    Backbone,
    BaseNestableModel,
    EntityCollection
) {

    'use strict';

    return BaseNestableModel.extend({

        defaults: {

            width: 0,
            height: 0,
            background: null,
            entities: new EntityCollection(),
            is_active: true

        },

        nestedModels: {
            entities: EntityCollection
        }

    });

});
