/*global define*/

/**
 * For the part of the header where we display the user's username with a dropdown popup.
 */
define([
    'jquery',
    'backbone.marionette',
    'communicator',
    'hbs!tmpl/view/header/user_template',
    'foundation',
    'foundation.dropdown'
], function(
    $,
    Marionette,
    Communicator,
    usernameTemplate
) {

    'use strict';

    return Marionette.ItemView.extend({
        template: {
            type: 'handlebars',
            template: usernameTemplate
        },

        modelEvent: {
            'sync': 'onSync'
        },

        events: {
            'click #btn-signout': 'onClickSignOut'
        },

        onShow: function() {

            // Foundation JavaScript hook for the popup
            $(document).foundation();

        },

        onClickSignOut: function() {
            Communicator.mediator.trigger('user:logout');
        },

        serializeData: function () {
            return {
                username: this.model.get( 'username' ),
                isLoggedIn: this.model.isLoggedIn()
            };
        }

    });

});
