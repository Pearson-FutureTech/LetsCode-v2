/*global define:true*/

/**
 * For the part at the top of the page where we might have things such as the Project and Share buttons.
 */
define([
    'backbone.marionette',
    'communicator',
    'views/layout/header_layout',
    'views/header/project_view',
    'views/header/uneditable_project_view',
    'views/header/user_view',
    'views/header/tutorial_view'
], function(
    Marionette,
    Communicator,
    HeaderLayout,
    ProjectView,
    UneditableProjectView,
    UserView,
    TutorialView
) {

    'use strict';

    var HeaderModule = new Marionette.Application();

    HeaderModule.addInitializer(function() {
        this.isFlashEnabled = false;

        /**
         * The Modernizr.flash property is set by a script in the head
         */

        if (window.Modernizr && window.Modernizr.flash) {
            this.isFlashEnabled = true;
        }

    });

    HeaderModule.addInitializer(function() {
        this.headerLayout = new HeaderLayout();

        HeaderModule.addRegions({
            header: '#top-bar'
        });

        HeaderModule.header.show(this.headerLayout);

    });

    HeaderModule.addInitializer(function() {

        var self = this,
            state = Communicator.reqres.request('app:state');

        state.on('change:view', function(model, view) {

            var user = Communicator.reqres.request('user');

            self.headerLayout.user.show(new UserView({ model: user }));

            if (view === 'project' || view === 'tutorialProject') {

                // Ensure project is loaded before render
                Communicator.mediator.once('project:loaded', self.render, self);

            } else {
                self.headerLayout.project.close();
                self.headerLayout.tutorial.close();
            }

        });

    });

    HeaderModule.render = function() {

        var state = Communicator.reqres.request('app:state'),
            user = Communicator.reqres.request('user'),
            project = Communicator.reqres.request('project'),
            view = state.get('view'),
            tutorial;

        var viewOptions = {
            isFlashEnabled: HeaderModule.isFlashEnabled,
            model: project
        };

        if (user.isLoggedIn() && (user.get('_id') === project.get('author_id'))) {
            // User is Logged In & Owns the project
            this.headerLayout.project.show(new ProjectView(viewOptions));

            if( view === 'tutorialProject' ) {
                // Extra panel for tutorials
                tutorial = Communicator.reqres.request('tutorial');
                this.headerLayout.tutorial.show( new TutorialView({model: tutorial}) );
            } else {
                this.headerLayout.tutorial.close();
            }

        } else {
            // User is Not Logged in and/or does not own the project
            this.headerLayout.project.show(new UneditableProjectView(viewOptions));
        }

    };

    return HeaderModule;

});
