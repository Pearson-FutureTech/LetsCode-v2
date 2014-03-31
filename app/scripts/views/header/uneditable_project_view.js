/*global define*/

/**
 * For the header when displaying another user's project (or we're not logged in).
 */
define([
    'jquery',
    'backbone.marionette',
    'communicator',
    'hbs!tmpl/view/header/uneditable_project_template'
], function(
    $,
    Marionette,
    Communicator,
    uneditableProjectTemplate
) {

    'use strict';

    return Marionette.ItemView.extend({
        template: {
            type: 'handlebars',
            template: uneditableProjectTemplate
        },

        events: {
            'click [data-control="preview-mode"]': 'onPlayMode'
        },

        serializeData: function() {

            var user = Communicator.reqres.request('user');

            return {isLoggedIn: user.isLoggedIn()};
        },

        onPlayMode: function() {
            $('#btn-preview').removeClass('deselected');
            Communicator.mediator.trigger('ide:mode:play');
        }
    });

});
