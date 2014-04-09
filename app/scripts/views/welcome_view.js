/*global define:true*/

/**
 * For the home page.
 */
define([
    'underscore',
    'communicator',
    'backbone',
    'jquery',
    'vendor/jquery.cookiebar'
], function(
    _,
    Communicator,
    Backbone,
    $
) {

    'use strict';

    return Backbone.View.extend({

        initialize: function() {

            _.bindAll(
                this,
                'onSubmitLogin',
                'onSubmitSignUp',
                'onLoginError',
                'onSignUpError'
            );

            $.cookieBar({
                message: 'We use cookies for analytics and to remember your login',
                acceptText: 'OK'
            });

        },

        el: '.welcome-page',

        events: {

            'submit #login-form': 'onSubmitLogin',
            'submit #sign-up-form': 'onSubmitSignUp'

        },

        onSubmitLogin: function(e) {

            var $form = $(e.currentTarget),
                jqXHR,
                username = $form.find('[name="username"]').val();

            e.preventDefault();

            var that = this;

            if (username !== '') {

                jqXHR = $.ajax({
                    url: '/api/user/sign_in',
                    type: 'POST',
                    data: {
                        username: username,
                        // The server requires a password field to be sent
                        password: 'not-really-a-password'
                    }
                });

                jqXHR.done(function(data) {

                    if (data.status === 'fail') {

                        if (data.message === 'Missing credentials') {
                            that.onLoginError('No username');
                        }
                        else if (data.message === 'Incorrect username') {
                            that.onLoginError('Incorrect username');
                        }

                    }
                    else {
                        // TODO use an event and just do window.location.href change in one place
                        //Communicator.mediator.trigger('user:signin:success', data.username);
                        window.location.href = '/tutorials';
                    }

                });

                jqXHR.fail(function() {
                    that.onLoginError();
                });

            }
            else {
                that.onLoginError();
            }

        },

        onSubmitSignUp: function(e) {

            var $tsAndCsDiv = $('.agree-ts-and-cs'),
                $tsAndCsCheckbox = $('#ts-and-cs-check');

            e.preventDefault();

            if( $tsAndCsCheckbox.is(':checked') ) {

                $tsAndCsDiv.removeClass('error');

                this.doSignUp(e);

            } else {
                $tsAndCsDiv.addClass('error');
            }

        },

        doSignUp: function() {

            var jqXHR = $.ajax({
                    url: '/api/user/sign_up',
                    type: 'POST'
                });

            jqXHR.done(function(data) {
                // TODO use an event and just do window.location.href change in one place
                //Communicator.mediator.trigger('user:signup:success', data.username);
                window.location.href = '/profile/' + data.username;
            });

            jqXHR.fail(function() {
                this.onSignUpError();
            });

        },

        onLoginError: function() {
            var $loginForm = this.$('#login-form');

            $loginForm.removeClass('form--no-error');
            $loginForm.find('.form_error').text('Oops. Please check your username.');
        },

        onSignUpError: function() {
            // TODO handle sign up errors
        }

    });

});
