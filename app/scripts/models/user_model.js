/*jshint camelcase:false*/

/**
 * Model definition for users.
 */
define([
    'backbone'
], function (Backbone) {

    'use strict';

    return Backbone.Model.extend({

        initialize: function () {},

        idAttribute: 'username',
        urlRoot: '/api/users',

        defaults: {

            // User ID
            _id: null,

            // Unique login used for authentication
            username: null,

            // Registration date
            registered_at: new Date(),

            // Last login date
            last_login_at: null,

            // User account status
            is_active: true,

            // References from tutorial number (format: "level-number", e.g. "1-2") to Project IDs
            // This means redundancy, but it's useful to speed up process of finding user's project for each tutorial
            tutorial_project_refs: {},

            // Projects
            projects: [],

            // Number of the next available tutorial level for the user (defaults to 1)
            next_tutorial_level: 1,

            // Number of the next available tutorial inside the tutorial level (defaults to 1)
            next_tutorial_number: 1,

            // Temporary - not stored in DB - just so we can display on confirmation page
            email: null

        },

        isLoggedIn: function() {
            return this.get('username') !== null;
        },

        parse: function(res) {
            return res.data;
        },

        setTutorialCompleted: function(level, number) {

            var currentLevel = this.get('next_tutorial_level'),
                currentNumber = this.get('next_tutorial_number');

            // TODO if this is the last tutorial for this level, then progress to next level

            this.set( 'next_tutorial_level', Math.max(currentLevel, level) );
            this.set( 'next_tutorial_number', Math.max(currentNumber, number+1) );

        }

    });

});
