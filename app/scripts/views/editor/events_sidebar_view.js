/*global define:true*/
/*jshint camelcase:false*/

/**
 * For the edit panel sidebar where we have links for each event.
 */
define([
    'jquery',
    'communicator',
    'backbone.marionette',
    'hbs!tmpl/view/editor/events_sidebar_template'
], function(
    $,
    Communicator,
    Marionette,
    eventsTemplate
) {

    'use strict';

    return Marionette.ItemView.extend({

        template: {
            type: 'handlebars',
            template: eventsTemplate
        },

        ui: {
            elements: '[data-control="element"]'
        },

        events: {
            'click [data-control="add-element"]': 'onClickAddElement',
            'click [data-control="element"]': 'onClickElement'
        },

        modelEvents: {
            'change': 'onModelChange'
        },

        initialize: function() {
            this.ideModel = Communicator.reqres.request( 'ide:model' );
        },

        onShow: function() {
            this.ideModel.on( 'change:selectedEvent', this.highlightSelected, this );
            this.ideModel.on( 'change:selectedEntity', this.render, this );
        },

        onClose: function() {
            this.ideModel.off( 'change:selectedEvent', this.highlightSelected, this );
            this.ideModel.off( 'change:selectedEntity', this.render, this );
        },

        onModelChange: function() {
            this.render();
        },

        onClickElement: function( e ) {
            var eventName = $( e.target ).attr( 'data-value'),
                currentSelectedEventName = this.ideModel.getSelectedEventName();

            if( currentSelectedEventName !== eventName ) {
                // Select
                Communicator.mediator.trigger( 'event:selected', eventName );
            } else {
                // Already selected - unselect
                Communicator.mediator.trigger( 'event:selected', null );
            }
        },

        onClickAddElement: function() {
            // TODO: Open dialog to add new event
        },

        serializeData: function() {
            return {
                events: this.model ? this.model.get('events').toJSON() : null
            };
        },

        highlightSelected: function() {
            var ideModel = Communicator.reqres.request( 'ide:model' ),
                selectedEventName = ideModel.getSelectedEventName(),
                elements = this.ui.elements;

            elements.filter('.selected').removeClass( 'selected');
            elements.filter('[data-value="' + selectedEventName + '"]').addClass('selected');
        }

    });

});
