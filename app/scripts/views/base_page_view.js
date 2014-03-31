/*global define:true*/

/**
 * 'Base class' (or 'super view') for non-IDE pages.
 */
define([
    'jquery',
    'backbone'
], function(
    $,
    Backbone
) {

    'use strict';

    return Backbone.Marionette.ItemView.extend({

        onShow: function() {

            // Remove top-level class that should only exist for project page
            $('#main').removeClass('project');

        }

    });

});

