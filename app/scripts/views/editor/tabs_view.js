/*global define:true*/

/**
 * The tabs on the edit panel (Methods, Properties, Events).
 */
define([
    'jquery',
    'communicator',
    'backbone.marionette',
    'hbs!tmpl/view/editor/tabs_template'
], function(
    $,
    Communicator,
    Marionette,
    tabsTemplate
) {

    'use strict';

    return Marionette.ItemView.extend({
        template: {
            type: 'handlebars',
            template: tabsTemplate
        },

        events: {
            'click .tabs a': 'onClickTab'
        },

        ui: {
            tabs: '.tabs a'
        },

        onClickTab: function( e ) {

            e.preventDefault();

            var element = $( e.target ),
                panelId = element.attr( 'href'),
                panelName = panelId.substring('#panel-'.length);

            Communicator.mediator.trigger( 'tab:select', panelName );

        }
    });

});
