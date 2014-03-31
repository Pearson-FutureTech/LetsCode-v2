/*global define*/

/**
 * For core user tasks.
 */
define([
	'backbone.marionette',
	'communicator',
	'models/user_model'
], function(
	Marionette,
	Communicator,
	UserModel
) {

	'use strict';

	var UserModule = new Marionette.Application();

	UserModule.addInitializer(function () {

		var user = new UserModel({});

		Communicator.reqres.setHandler( 'user', function () {
			return user;
		});

        Communicator.reqres.setHandler('user:refresh_is_user_logged_in', function(cbk) {
            var jqXHR = user.fetch();

            jqXHR.error(function(){
                // We likely hit a 403 forbidden. This is standard REST and means we are logged out.
                // Do nothing.. Consider this handled.
            });

            jqXHR.complete(function(){
                cbk(user.isLoggedIn());
            });
        }, this);

        Communicator.mediator.on('user:signup:success', function (username) {
			user.set('username', username);
			user.fetch();

		}, this);

		Communicator.mediator.on('user:signin:success', function (username) {
			user.set('username', username);
			user.fetch();
		}, this);

        Communicator.mediator.on('user:signup:email:sent', function (username, email) {
            user.set('email', email);
        }, this);

        Communicator.mediator.on('user:logout', function() {
            // Clear user before redirecting, in case of caching issues
            user.clear({silent: true});
            Communicator.mediator.trigger('user:logout:request');
        });

    });

	return UserModule;

});
