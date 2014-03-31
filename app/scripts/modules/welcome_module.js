/*global define:true*/

/**
 * For the Welcome page, i.e. the homepage.
 */
define([
	'backbone.marionette',
	'views/welcome_view'
], function(
	Marionette,
	WelcomeView
) {

	'use strict';

	var WelcomeModule = new Marionette.Application();

	WelcomeModule.addInitializer(function() {

		WelcomeModule.addRegions({
			content: '#content'
		});

		WelcomeModule.content.attachView( new WelcomeView() );

	});

	return WelcomeModule;

});
