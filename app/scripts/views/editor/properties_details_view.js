/*global define:true*/
/*jshint camelcase:false*/

/**
 * For the Properties panel where we display object properties (and they can be edited if not hidden or read-only).
 */
define([
    'jquery',
    'underscore',
    'communicator',
    'backbone.marionette',
    'hbs!tmpl/view/editor/properties_details_template'
], function(
    $,
    _,
    Communicator,
    Marionette,
    propertiesDetailsTemplate
) {

    'use strict';

    var PropertiesDetailsView = Marionette.ItemView.extend({

        template: {
            type: 'handlebars',
            template: propertiesDetailsTemplate
        },

        ui: {
            button: '.button'
        },

        events: {
            'change input': 'onChangeValue'
        },

        modelEvents: {
            'change': 'onModelChange'
        },

        onModelChange: function() {
            this.render();
        },

        initialize: function() {
            this.ideModel = Communicator.reqres.request( 'ide:model' );
        },

        onShow: function() {
            // FIXME better just to use the model change event, but that's not working properly for some reason...
            Communicator.mediator.on('entity:updated', this.onEntityUpdated, this);
        },

        onClose: function() {
            Communicator.mediator.off('entity:updated', this.onEntityUpdated, this);
        },

        onChangeValue: function( e ) {

            var $target = $( e.target ),
                propertyName = $target.attr( 'data-name' ),
                previousValue = this.model.getPropertyValue( propertyName ),
                value = $target.val(),
                property = this.model.get('properties').findWhere( {name: propertyName} ),
                type = property.get('type');

            // FIXME Should this be done here? It doesn't seem like the right place. Should at least move to utils...
            // We'll likely need to add other types soon too (e.g. boolean)...
            if( type ) {
                if( type === 'int' ) {
                    value = parseInt( value, 10 );
                } else if( type === 'float' ) {
                    value = parseFloat( value );
                }
            }

            // This check is to get around the problem whereby updating the property triggers render()
            // which triggers the change event again!
            if( value !== previousValue ) {

                this.model.setPropertyValue( propertyName, value );

                // TODO see if we can replace this with default Backbone change event
                Communicator.mediator.trigger( 'entity:updated', this.model.get('id') );

            }

        },

        onEntityUpdated: function(entityId) {
            if( this.model.get('id') === entityId ) {
                this.render();
            }
        },

        serializeData: function() {

            var properties = this.model ? this.model.get('properties') : null,
                propertiesWithStrings = null;

            if( properties ) {
                // Clone to make sure we don't override actual properties
                propertiesWithStrings = JSON.parse( JSON.stringify(properties.models) );
                this.stringifyProperties(propertiesWithStrings);
            }

            return {
                properties: propertiesWithStrings,
                entityId: this.model ? this.model.get('id') : null
            };
        },

        // This is for when we have e.g. a boolean false value - we need to render the string "false"
        // TODO Should move somewhere else like utils
        stringifyProperties: function( properties ) {

            if( properties ) {

                for( var i=0; i < properties.length; i++ ) {

                    var value = properties[i].value;

                    if( value !== null && value !== undefined && value.toString ) {
                        properties[i].value = value.toString();
                    }

                }

            }

        }

    });

    return PropertiesDetailsView;

});
