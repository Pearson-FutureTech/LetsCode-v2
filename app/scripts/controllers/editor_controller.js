/*global define:true*/

/**
 * Controller for the edit panel.
 */
define([
    'backbone.marionette',
    'communicator',
    'views/layout/editor_layout'
], function(
    Marionette,
    Communicator,
    EditorLayout
    ) {

    'use strict';

    var EditorController = Marionette.Controller.extend({

        initialize: function() {

            this.editorRegion = new Marionette.Region({
                el: '#editor'
            });

            this.editorLayout = new EditorLayout();

        },

        show: function() {

            this.editorRegion.show(this.editorLayout);
            this.editorLayout.animateOpen();

        },

        hide: function() {

            var self = this;

            this.editorLayout.animateClose( function() {
                self.editorRegion.close();
            });

        }

    });

    return EditorController;

});
