/*global define:true*/

/**
 * For the page shown after a user signs up, telling them their username.
 */
define([
    'backbone.marionette',
    'views/profile_view',
    'communicator'
], function (
    Marionette,
    ProfileView,
    Communicator
) {

    'use strict';

    var ProfileModule = new Marionette.Application();

    ProfileModule.addInitializer(function () {

        ProfileModule.addRegions({
            content: '#content'
        });

        // User module provides this handler
        if (Communicator.reqres.hasHandler('user')) {
            var user = Communicator.reqres.request('user');
            ProfileModule.content.show(new ProfileView({ model: user }));
        }

    });

    return ProfileModule;

});
