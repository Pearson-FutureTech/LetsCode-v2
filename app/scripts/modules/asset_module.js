/*global define*/

/**
 * For assets that make up the 'asset library' or 'object library', i.e. objects you can add to the stage,
 * e.g. an athlete object.
 */
define([
	'backbone.marionette',
	'communicator',
	'collections/asset_collection'
], function(
	Marionette,
	Communicator,
    AssetCollection
) {

	'use strict';

	var AssetModule = new Marionette.Application();

	AssetModule.addInitializer(function () {

        this.assetCollection = new AssetCollection();
        this.assetCollection.fetch();

        Communicator.reqres.setHandler('asset:library', function() {
            return this.assetCollection;
        }, this);

    });

	return AssetModule;

});
