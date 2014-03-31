/*global define*/

/**
 * Extra header panel for tutorials (appears underneath the main header).
 */
define([
    'jquery',
    'backbone.marionette',
    'underscore',
    'communicator',
    'hbs!tmpl/view/header/tutorial_template'
], function(
    $,
    Marionette,
    _,
    Communicator,
    tutorialTemplate
) {

    'use strict';

    return Marionette.ItemView.extend({

        initialize: function() {

            Communicator.mediator.on('tutorial:end', this.close, this);
            Communicator.mediator.on('project:close', this.close, this);

            this.listenTo(this.model, 'change', this.render);
        },

        template: {
            type: 'handlebars',
            template: tutorialTemplate
        },

        events: {
            'click .end-tutorial': 'onClickEnd'
        },

        onClickEnd: function() {

            var project = Communicator.reqres.request('project'),
                projectId = project ? project.get('_id') : null;

            // Triggers closure of tutorial and switch to /project/... URL
            Communicator.mediator.trigger('tutorial:end', projectId);

        },
        
        serializeData: function() {
            return {
                tutorial: this.model ? this.model.toJSON() : null
            };
        }

    });

});
