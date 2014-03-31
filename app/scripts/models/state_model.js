/**
 * For general app state.
 */
define([
    'backbone'
], function(
    Backbone
) {
    'use strict';

    var StateModel;

    StateModel = Backbone.Model.extend({

        defaults: {
            projectId: null,
            username: null,
            view: null,
            state: null
        },

        initialize: function() {
            this.on('change:projectId', this.updateState, this);
            this.on('change:username', this.updateState, this);
            this.on('change:view', this.updateState, this);
        },

        updateState: function() {

            var view = this.get('view');

            if( (view === 'project' || view === 'tutorialProject') && this.get('username') === null ) {
                this.set('state', 'preview');
            }

            if( (view === 'project' || view === 'tutorialProject') && this.get('username') !== null ) {
                this.set('state', 'edit');
            }

            if ( view === 'welcome') {
                this.set('state', 'welcome');
            }

            if ( view === 'profile') {
                this.set('state', 'profile');
            }
        }
    });

    return StateModel;
});
