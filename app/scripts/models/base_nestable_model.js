/**
 * For models that have other models nested inside them.
 *
 * Based on rycfung's answer here:
 * http://stackoverflow.com/questions/6535948/nested-models-in-backbone-js-how-to-approach
 */
define([
    'backbone'
],

    function(Backbone) {

        'use strict';

        return Backbone.Model.extend({

            // Models extending this should define their name -> model associations under 'nestedModels'
            nestedModels: {},

            parse: function(response) {

                for( var key in this.nestedModels ) {

                    var NestedClass = this.nestedModels[key];
                    var nestedData = response[key];

                    response[key] = new NestedClass(nestedData, {parse:true});
                    
                }

                return response;

            }

        });

    }

);
