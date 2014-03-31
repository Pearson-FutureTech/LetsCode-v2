/*global define:true*/

/**
 * Layout for the top part of the page.
 */
define([
    'backbone',
    'jquery'
], function(
    Backbone,
    $
) {

    'use strict';

    var HeaderLayout;

    HeaderLayout = Backbone.Marionette.Layout.extend({

        template: '#top-bar',

        regions: {
            project: '#project-controls',
            user: '#user-controls',
            tutorial: '#tutorial-panel'
        },

        events: {
            'click [data-clientside="true"]': 'onClickClientSideLink'
        },

        onClickClientSideLink: function(e) {

            e.preventDefault();

            var href = $(e.currentTarget).attr('href');
            Backbone.history.navigate(href, {trigger: true});

        }

    });

    return HeaderLayout;

});
