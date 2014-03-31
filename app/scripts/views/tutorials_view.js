/*global define:true*/
/*jshint camelcase:false*/

/**
 * For the page listing the tutorials.
 */
define([
    'underscore',
    'jquery',
    'communicator',
    'backbone',
    'views/base_page_view',
    'hbs!tmpl/view/tutorials_tmpl'
], function(
    _,
    $,
    Communicator,
    Backbone,
    BasePageView,
    TutorialsTmpl
) {

    'use strict';

    return BasePageView.extend({

        initialize: function() {
            _.bindAll(
                this,
                'onClickRow',
                'onClickBegin'
            );

        },

        template: {
            type: 'handlebars',
            template: TutorialsTmpl
        },

        events: {
            'click .row': 'onClickRow',
            'click a[data-action="begin"]': 'onClickBegin',
            'click a[data-action="resume"]': 'onClickResume',
            'click a[data-action="restart"]': 'onClickRestart',
            'click a[data-clientside="true"]': 'onClickClientSideLink'
        },

        onShow: function() {

            BasePageView.prototype.onShow();

            // Listen for update to user model to update page when tutorial is completed
            this.model.user.on('change', this.onUserChange, this);
            this.model.user.on('reset', this.onUserChange, this);

        },

        onClose: function() {

            this.model.user.off('change', this.onUserChange, this);
            this.model.user.off('reset', this.onUserChange, this);

        },

        onUserChange: function() {
            this.render();
        },

        onClickRow: function(e) {

            var $thisItem = $(e.currentTarget).parents('.item');

            if( !$thisItem.hasClass('next') ) {
                $thisItem.toggleClass('hidden');
            }

        },

        onClickBegin: function(e) {

            var tutorialId = $(e.currentTarget).attr('data-tutorialId');

            e.preventDefault();

            this.startNewTutorialProject( tutorialId );

        },

        onClickResume: function(e) {

            var $linkElement = $(e.currentTarget),
                projectId = $linkElement.attr('data-projectId');

            e.preventDefault();

            // Check parent is expanded first, otherwise click will be accidental
            if( $linkElement.parents('.item').hasClass('hidden') ) {
                return;
            }

            Communicator.mediator.trigger('project:open', projectId);

        },

        onClickRestart: function(e) {

            var $linkElement = $(e.currentTarget),
                tutorialId = $linkElement.attr('data-tutorialId');

            e.preventDefault();

            // Check parent is expanded first, otherwise click will be accidental
            if( $linkElement.parents('.item').hasClass('hidden') ) {
                return;
            }

            this.startNewTutorialProject( tutorialId );

        },

        // Prevent request going to server - we can handle this on the client
        onClickClientSideLink: function(e) {

            e.preventDefault();

            var href = $(e.currentTarget).attr('href');
            Backbone.history.navigate(href, {trigger: true});

        },

        startNewTutorialProject: function(tutorialId) {

            var createTutorialProjectUrl = '/api/projects/createProjectFromTutorial';

            $.post(createTutorialProjectUrl, {tutorialId: tutorialId}, function(response) {
                // FIXME we receive the whole project data here, but we're not using it - we're fetching it down again
                // See project_module on 'project:route:loaded'.
                Communicator.mediator.trigger('tutorial:open', tutorialId, response.data._id);
            });

        },

        serializeData: function() {

            var user = this.model.user,
                nextTutorialNumber = user.get('next_tutorial_number') || 1,
                tutorials = [],
                tutorial;

            for( var i=0; i < this.model.tutorials.models.length; i++ ) {

                tutorial = this.model.tutorials.models[i];

                tutorials[i] = {

                    _id: tutorial.get('_id'),
                    level: tutorial.get('level'),
                    number: tutorial.get('number'),
                    name: tutorial.get('name'),
                    description: tutorial.get('description'),
                    steps: tutorial.get('steps'),

                    completed: tutorial.get('number') < nextTutorialNumber,
                    next: tutorial.get('number') === nextTutorialNumber,
                    locked: tutorial.get('number') > nextTutorialNumber,

                    project_id: user.get('tutorial_project_refs')[tutorial.getLevelAndNumberString()]
                };

            }

            return {
                user: user.toJSON(),
                tutorials: tutorials
            };
        }

    });

});
