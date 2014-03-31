/*global define:true*/

/**
 * Page for after user sign up.
 */
define([
    'underscore',
    'jquery',
    'communicator',
    'backbone',
    'views/base_page_view',
    'hbs!tmpl/view/profile_tmpl'
], function(
    _,
    $,
    Communicator,
    Backbone,
    BasePageView,
    ProfileTmpl
) {

    'use strict';

    return BasePageView.extend({

        template: {
            type: 'handlebars',
            template: ProfileTmpl
        },

        ui: {
            'emailAddress': 'form.email input[type="text"]'
        },

        events: {
            'click .skip-email': 'onSkip',
            'submit form.email': 'onSubmitEmail'
        },

        modelEvents: {
            'change:username': 'render'
        },

        onSkip: function() {

            // TODO for now we're just going straight through but this needs to give a confirmation page

            var project,
                username;

            username = this.model.get('username');

            if (Communicator.reqres.hasHandler('project')) {

                project = Communicator.reqres.request('project');

                Communicator.mediator.trigger('user:new:start', project.get('id'), username);
            }
        },

        onSubmitEmail: function(e) {
            e.preventDefault();

            // There is no good regex to support international character sets etc.
            // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
            // Let's not be clever then get caught out by someone using it in Turkey. Just match @.
            var emailPattern = /@/,
                email = this.ui.emailAddress.val(),
                self = this;

            if (!email.length) {
                this.onEmailError();
                return;
            }

            var matches = email.match(emailPattern);

            if (!matches) {
                this.onEmailError();
                return;
            }

            $.post('/api/user/email', {
                email: email
            }, function() {
                // Success. The router will take us to the next page...
                Communicator.mediator.trigger('user:signup:email:sent', self.model.get('username'), email);

            });

        },

        onEmailError: function() {
            var $loginForm = this.$('form.email');
            $loginForm.addClass('error');
            $loginForm.find('.form-error').show();
        },

        serializeData: function() {
            return {
                username: this.model.get('username')
            };
        }

    });

});
