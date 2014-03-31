/*jshint camelcase:false*/
/*global define:true*/

/**
 * For the controls at the top of the edit panel, i.e. the Object Selector and the Add Object button and popup.
 */
define([
    'communicator',
    'backbone.marionette',
    'hbs!tmpl/view/editor/controls_template'
], function(
    Communicator,
    Marionette,
    controlsTemplate
) {

    'use strict';

    return Marionette.ItemView.extend({

        template: {
            type: 'handlebars',
            template: controlsTemplate
        },

        ui: {
            'entityOptions': '[data-control="entities"] option',
            'addEntity': '[data-control="add-entity"]',
            'entityLibrary': '[data-control="entity-library"]'
        },

        events: {
            'change [data-control="entities"]': 'onSelectEntity',
            'click [data-control="add-entity"]': 'onClickAddEntity',
            'click [data-control="entity-library"] li': 'onClickAddEntityItem',
            'click #entity-library .close-button': 'onClickAddEntityClose'
        },

        modelEvents: {
            'change': 'onModelChange'
        },

        onModelChange: function() {
            this.render();
        },

        onRender: function() {
            this.updateEntitySelectedInDropdown();
        },

        onShow: function() {

            Communicator.mediator.on( 'entity:selected', this.updateEntitySelectedInDropdown, this );
            Communicator.mediator.on( 'ide:stage:addedEntity', this.render, this );

        },

        onClose: function() {

            Communicator.mediator.off( 'entity:selected', this.updateEntitySelectedInDropdown, this );
            Communicator.mediator.off( 'ide:stage:addedEntity' );
            
        },

        updateEntitySelectedInDropdown: function() {

            var ideModel = Communicator.reqres.request( 'ide:model' ),
                selectedEntityId = ideModel.getSelectedEntityId(),
                options =  this.$('[data-control="entities"] option');

            options.removeAttr( 'selected' );

            if( selectedEntityId !== null) {
                options
                    .filter( '[value="' + selectedEntityId + '"]' )
                    .attr( 'selected', 'selected' );
            }
        },

        onClickAddEntity: function() {
            this.ui.entityLibrary.fadeToggle();
            this.ui.addEntity.toggleClass('displayed');
        },

        onClickAddEntityItem: function(e) {

            var assetLibrary = Communicator.reqres.request('asset:library'),
                entityToAdd = assetLibrary.get(this.$(e.currentTarget).data('entityId'));

            this.onClickAddEntity();
            Communicator.mediator.trigger( 'ide:stage:addEntity', entityToAdd );
        },

        onClickAddEntityClose: function(e) {
            e.preventDefault();
            this.onClickAddEntity();
        },

        onSelectEntity: function() {

            var selectedEntityId = this.ui.entityOptions.filter( ':selected' ).val();

            Communicator.mediator.trigger( 'entity:selected', selectedEntityId );

        },

        serializeData: function() {

            var entities = Communicator.reqres.request('entities'),
                assetLibrary = Communicator.reqres.request('asset:library'),
                stageEntities = [],
                libraryEntities = [];

            if( entities ) {
                entities.each(function(entity) {
                    stageEntities.push( entity.toJSON() );
                });
            }

            if( assetLibrary ) {
                assetLibrary.each(function(entity) {
                    libraryEntities.push( entity.toJSON() );
                });
            }

            return {
                stageEntities: stageEntities,
                libraryEntities: libraryEntities
            };
        }

    });

});
