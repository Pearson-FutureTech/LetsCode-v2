/**
 * NOT CURRENTLY USED.
 * For recording the state of projects in local storage, so we can undo and redo individual steps.
 */
define([
    'backbone'
], function( Backbone ) {

    'use strict';

    var RecordModel;

    /**
     * Expected use:
     *
     *     var projectId = project.get( 'id' ),
     *         since = project.get( 'updated_at' ); // the last time the model was saved.
     *
     *     var steps = new Record({
     *         key: projectId
     *     }, since );
     */
    RecordModel = Backbone.Model.extend({

        defaults: {
            key: null,
            pointer: 0,
            updated: null,
            steps: []
        },

        initialize: function( data, options ) {
            this.storage = options.storage;
            this.load( options.since );

            this.on( 'change', this.onChangeSteps, this );
        },

        load: function( since ) {
            var key = this.get( 'key' ),
                record = this.storage.getItem( key );

            if( record ) {
                record = JSON.parse( record );
                record.updated = new Date( record.updated );
                // Ditch the record if it's older than the save
                if( record && record.updated > since || !since ) {
                    this.attributes = record;
                } else {
                    this.resetStorage();
                }

            }
        },

        onChangeSteps: function() {
            var key = this.get( 'key' ),
                record =  JSON.stringify( this.attributes );

            // blithly overwrite what was there before
            this.storage.setItem( key, record );
        },

        resetStorage: function() {
            var key = this.get( 'key' );

            this.storage.removeItem( key );
        },

        record: function( data ) {
            var steps = this.get( 'steps' ),
                pointer = this.get( 'pointer' ),
                stringify = JSON.stringify( data );

            if( stringify !== steps[ pointer ] ) {

                // Overwrite later changes, a fork in history.
                steps.splice( pointer + 1, steps.length, JSON.stringify( data ) );

                // keep a maxium of 10 steps
                steps = steps.slice( -10 );

                // update pointer
                pointer = steps.length - 1;

                this.set({
                    'pointer': pointer,
                    'steps': steps,
                    'updated': new Date()
                });
            }

        },

        step: function( pointer ) {
            var steps = this.get( 'steps' );

            if( steps.length > 0 && steps.length > pointer ) {
                return JSON.parse( steps[ pointer ] );
            } else {
                return null;
            }

        },

        undo: function() {
            var pointer = this.get( 'pointer' );

            pointer = pointer > 0 ? pointer - 1 : pointer;

            this.set( 'pointer', pointer );

            return this.step( pointer );
        },

        redo: function() {
            var pointer = this.get( 'pointer' ),
                steps = this.get( 'steps' );

            pointer = pointer < steps.length ? pointer + 1 : pointer;

            this.set( 'pointer', pointer );

            return this.step( pointer );
        },

        current: function() {
            var pointer = this.get( 'pointer' );

            return this.step( pointer );
        }

    });

    return RecordModel;

});
