/*jshint camelcase:false*/

/**
 * Represents the state of the IDE (Integrated Development Environment), i.e. the part of the app where we manipulate
 * and run projects.
 */
define([
    'backbone'
], function( Backbone ) {

    'use strict';

    var DEFAULT_SELECTED_ENTITY_ID = 'myScene';

    return Backbone.Model.extend({

        initialize: function() {},

        defaults: {
            selectedEntity: DEFAULT_SELECTED_ENTITY_ID,
            selectedMethod: null,
            selectedEvent: null,
            allowEdit: true
        },

        getSelectedEntityId: function() {
            return this.get( 'selectedEntity' );
        },

        setSelectedEntityId: function( selectedEntityId ) {
            if( !selectedEntityId || selectedEntityId === '' ) {
                selectedEntityId = DEFAULT_SELECTED_ENTITY_ID;
            }
            this.resetMethodAndEventSelection();
            this.set( 'selectedEntity', selectedEntityId );
        },

        getSelectedMethodName: function() {
            return this.get( 'selectedMethod' );
        },

        setSelectedMethodName: function( selectedMethodName ) {
            this.resetMethodAndEventSelection();
            this.set( 'selectedMethod', selectedMethodName );
        },

        getSelectedEventName: function() {
            return this.get( 'selectedEvent' );
        },

        setSelectedEventName: function( selectedEventName ) {
            this.resetMethodAndEventSelection();
            this.set( 'selectedEvent', selectedEventName );
        },

        resetMethodAndEventSelection: function() {
            this.set( 'selectedMethod', null );
            this.set( 'selectedEvent', null );
        },

        allowEdit: function( allowEdit ) {
            this.set( 'allowEdit', allowEdit );
        }

    });

});
