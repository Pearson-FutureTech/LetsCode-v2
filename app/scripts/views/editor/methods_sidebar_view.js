/*global define:true*/
/*jshint camelcase:false*/

/**
 * For the edit panel sidebar where we have links for each method.
 */
define([
    'jquery',
    'communicator',
    'backbone.marionette',
    'hbs!tmpl/view/editor/methods_sidebar_template'
], function(
    $,
    Communicator,
    Marionette,
    methodsTemplate
) {

    'use strict';

    return Marionette.ItemView.extend({

        template: {
            type: 'handlebars',
            template: methodsTemplate
        },

        ui: {
            elements: '[data-control="element"]'
        },

        events: {
            'click [data-control="element"]': 'onClickElement',
            'click [data-control="add-element"]': 'onClickAddElement'
        },

        modelEvents: {
            'change': 'onModelChange'
        },

        serializeData: function() {
            return {
                methods: this.model ? this.model.get('methods').toJSON() : null
            };
        },

        initialize: function() {
            this.ideModel = Communicator.reqres.request( 'ide:model' );
        },

        onShow: function() {
            this.ideModel.on( 'change:selectedMethod', this.highlightSelected, this );
            this.ideModel.on( 'change:selectedEntity', this.render, this );
        },

        onClose: function() {
            this.ideModel.off( 'change:selectedMethod', this.highlightSelected, this );
            this.ideModel.off( 'change:selectedEntity', this.render, this );
        },

        onModelChange: function() {
            this.render();
        },

        onClickElement: function( e ) {
            var methodName = $( e.target ).attr( 'data-value'),
                currentSelectedMethodName = this.ideModel.getSelectedMethodName();

            if( currentSelectedMethodName !== methodName ) {
                // Select
                Communicator.mediator.trigger( 'method:selected', methodName );
            } else {
                // Already selected - unselect
                Communicator.mediator.trigger( 'method:selected', null );
            }
        },

        onClickAddElement: function() {
            // TODO: Open dialog to add new method
        },

        highlightSelected: function() {
            var ideModel = Communicator.reqres.request( 'ide:model' ),
                selectedMethodName = ideModel.getSelectedMethodName();

            this.ui.elements.removeClass( 'selected' );
            this.ui.elements.filter( '[data-value="' + selectedMethodName + '"]' ).addClass( 'selected' );
        }

    });

});
