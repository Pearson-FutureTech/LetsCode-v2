/*global define:true*/

/**
 * For the page shown after emailing the user a reminder of their password.
 */
define([
    'backbone.marionette',
    'views/profile_email_sent_view',
    'communicator'
], function (
    Marionette,
    ProfileEmailSentView,
    Communicator
) {

    'use strict';

    var ProfileEmailSentModule = new Marionette.Application();

    ProfileEmailSentModule.addInitializer(function () {

        ProfileEmailSentModule.addRegions({
            content: '#content'
        });

        // User module provides this handler
        if (Communicator.reqres.hasHandler('user')) {
            var user = Communicator.reqres.request('user');
            ProfileEmailSentModule.content.show(new ProfileEmailSentView({ model: user }));
        }

    });

    return ProfileEmailSentModule;

});
