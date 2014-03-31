/**
 * For general things to do with the IDE (Integrated Development Environment).
 */
define([
    'backbone.marionette',
    'communicator',
    'views/layout/ide_layout',
    'models/ide_model'
], function(
    Marionette,
    Communicator,
    IdeLayout,
    IdeModel
) {

    'use strict';

    var IdeModule = new Marionette.Application();

    IdeModule.addInitializer(function() {

        this.ideModel = new IdeModel();

        Communicator.reqres.setHandler('ide:model', function() {
            return IdeModule.ideModel;
        });

        Communicator.mediator.on('entity:selected', function(selectedEntityId) {
            IdeModule.ideModel.setSelectedEntityId(selectedEntityId);
        });

        Communicator.mediator.on('method:selected', function(selectedMethodName) {
            IdeModule.ideModel.setSelectedMethodName(selectedMethodName);
        });

        Communicator.mediator.on('event:selected', function(selectedEventName) {
            IdeModule.ideModel.setSelectedEventName(selectedEventName);
        });

        Communicator.mediator.on('ide:mode:edit', function() {
            IdeModule.ideModel.allowEdit(true);
        });

        Communicator.mediator.on('ide:mode:play', function() {
            IdeModule.ideModel.allowEdit(false);
        });

    });

    IdeModule.addInitializer(function () {

        this.addRegions({
            content: '#ide'
        });

    });

    IdeModule.show = function() {

        this.close();

        this.ideLayout = new IdeLayout();

        this.content.show(this.ideLayout);

    };

    IdeModule.close = function() {

        if( this.ideLayout ) {
            this.ideLayout.close();
            this.ideLayout = null;
        }

    };

    return IdeModule;

});
