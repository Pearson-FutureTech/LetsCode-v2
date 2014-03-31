/**
 * Model definition of a tutorial, i.e. a set of steps that guide a user through things.
 */
define([
    'backbone'
], function(
    Backbone
    ) {

    'use strict';

    return Backbone.Model.extend({

        idAttribute: '_id',

        defaults: {
            level: null,
            number: null,
            name: null,
            description: null,
            steps: []
        },

        getLevelAndNumberString: function() {
            return this.get('level') + '-' + this.get('number');
        }

    });

});