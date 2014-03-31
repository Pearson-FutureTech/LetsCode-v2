/*global define:true*/

/**
 * Page for after the username reminder has been emailed.
 */
define([
    'underscore',
    'jquery',
    'communicator',
    'backbone',
    'views/base_page_view',
    'hbs!tmpl/view/profile_email_sent_tmpl'
], function(
    _,
    $,
    Communicator,
    Backbone,
    BasePageView,
    ProfileEmailSentTmpl
) {

    'use strict';

    return BasePageView.extend({

        template: {
            type: 'handlebars',
            template: ProfileEmailSentTmpl
        },

        events: {
            'click .start': 'onStart'
        },

        modelEvents: {
            'change:username': 'render'
        },

        onStart: function() {

            var project,
                username;

            // Remove email address to make sure it doesn't get stored anywhere
            this.model.set('email', null);

            username = this.model.get('username');

            if (Communicator.reqres.hasHandler('project')) {

                project = Communicator.reqres.request('project');

                Communicator.mediator.trigger('user:new:start', project.get('id'), username);
            }
        },

        serializeData: function() {
            return {
                username: this.model.get('username'),
                email: this.model.get('email')
            };
        }

    });

});
