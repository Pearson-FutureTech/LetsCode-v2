/*jshint camelcase:false*/

/**
 * Model definition for projects. A project consists of a stage and a collection of entities.
 */
define([
    'underscore',
    'jquery',
    'backbone',
    'models/base_nestable_model',
    'models/project/stage_model'
],

function( _, $, Backbone, BaseNestableModel, StageModel) {

    'use strict';

    return BaseNestableModel.extend({

        urlRoot: '/api/projects',

        defaults: {

            // Server-side identifier
            _id: null,

            // Server-side version
            __v: null,

            // Client-side identifier
            id: null,

            // Reference user
            author_id: null,

            // Unique project name
            name: null,

            // Optional description
            description: null,

            // Project game stage
            stage: null,

            // Creation time
            created_at: new Date(),

            // Last update time
            updated_at: null,

            // Will it be displayed on homepage?
            is_featured: false

        },

        nestedModels: {

            'stage': StageModel

        },

        hasStage: function() {
            return !!this.get('stage');
        },

        /**
         * Convenience method.
         */
        getEntity: function( entityId ) {

            var entity = null,
                stage = this.get('stage');

            if( stage ) {
                entity = stage.get('entities').get(entityId);
            }

            return entity;

        },

        parse: function( res ) {

            return BaseNestableModel.prototype.parse.call(this, res.project);

        },

        isLoaded: function() {

            var stage = this.get('stage');

            return stage && stage.get('entities');

        },

        /**
         * Creates a project URL for sharing.
         * Gets the protocol and host from the window to avoid hardcoding the values.
         * Rewrites the path of the model URL into the corresponding view URL.
         */
        getShareUrl: function() {
            var url = this.url(),
                protocol = window.location.protocol,
                host = window.location.host,
                path = url.replace('/api/projects', '/project');

            return protocol + '//' + host + path;
        }

    });

});
