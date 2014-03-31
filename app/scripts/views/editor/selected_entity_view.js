/*global define:true*/

/**
 * The overlay that appears around an object on the stage when you select it.
 */
define([
    'underscore',
    'jquery',
    'communicator',
    'backbone',
    'hbs!tmpl/view/editor/selected_entity_template'
], function(
    _,
    $,
    Communicator,
    Backbone,
    SelectedEntityTmpl
    ) {

    'use strict';

    return Backbone.Marionette.ItemView.extend({

        template: {
            type: 'handlebars',
            template: SelectedEntityTmpl
        },

        events: {
            'click .edit-events .method': 'onEventClick',
            'click .edit-methods .method': 'onMethodClick'
        },

        // TODO find out why this isn't making it re-render automatically after drag and drop sets left + top properties
        modelEvents: {
            'change': 'render'
        },

        initialize: function(options) {

            var entities = Communicator.reqres.request( 'entities' );

            this.dispatcher = options.dispatcher;
            this.ideModel = Communicator.reqres.request( 'ide:model' );

            this.ideModel = Communicator.reqres.request( 'ide:model');
            this.selectedEntity = entities.get( this.ideModel.getSelectedEntityId() );

        },

        onShow: function() {

            $(window).on('resize', {context: this}, this.onWindowResize);

            Communicator.mediator.on('entity:updated', this.onEntityUpdated, this);
            Communicator.mediator.on('stage:scrolled', this.updateViewPosition, this);

            this.updateViewPosition();

        },

        onClose: function() {

            $(window).off('resize', this.onWindowResize);

            Communicator.mediator.off('entity:updated', this.onEntityUpdated, this);
            Communicator.mediator.off('stage:scrolled', this.updateViewPosition, this);

        },

        onRender: function() {
            this.updateViewPosition();
        },

        onEventClick: function(e) {
            // Open the events tab
            Communicator.mediator.trigger( 'tab:select', 'events' );

            // Select the Event
            var eventName = $( e.target ).attr( 'data-value' );
            Communicator.mediator.trigger( 'event:selected', eventName );
        },

        onMethodClick: function(e) {
            // Open the methods tab
            Communicator.mediator.trigger( 'tab:select', 'methods' );

            // Select the Method
            var methodName = $( e.target ).attr( 'data-value' );
            Communicator.mediator.trigger( 'method:selected', methodName );
        },

        onWindowResize: function(event) {
            if( event.data.context ) {
                event.data.context.updateViewPosition();
            }
        },

        // TODO ditch this when we get Backbone's in-built model change events working
        onEntityUpdated: function(entityId) {
            if( this.model.get('id') === entityId ) {
                this.updateViewPosition();
            }
        },

        updateViewPosition: function() {

            var $stage = $('#stage-canvas');

            // Shouldn't be the case that this gets called when the stage isn't on screen anymore, but just in case...
            if( $stage ) {

                // TODO for a saved project, these properties will have been stored in the DB as strings
                // This isn't the right place to parse them back to ints though - do it when we pull down from the server?
                // NB. Currently we're casting them in properties_details_view.js when we set them on the project.
                this.$el.parent().css({
                    left: parseInt(this.model.getPropertyValue('left')) + $stage.offset().left,
                    top: parseInt(this.model.getPropertyValue('top')) + $stage.offset().top - 40,
                    width: parseInt(this.model.getPropertyValue('width')),
                    height: parseInt(this.model.getPropertyValue('height')) + 20
                });

            }

        },

        serializeData: function () {

            return {
                id: this.model.get('id'),
                methods: this.model.get('methods').toJSON(),
                events: this.model.get('events').toJSON()
            };

        }

    });

});
