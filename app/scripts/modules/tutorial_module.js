/*global define:true*/
/*global console*/
/*jshint camelcase:false*/
/*jshint loopfunc:true*/

/**
 * For individual tutorials.
 */
define([
    'jquery',
    'underscore',
    'backbone.marionette',
    'views/tutorial_view',
    'models/project/event_listener_model',
    'collections/tutorial_collection',
    'communicator'
], function (
    $,
    _,
    Marionette,
    TutorialView,
    EventListenerModel,
    TutorialCollection,
    Communicator
    ) {

    'use strict';

    var TutorialModule = new Marionette.Application();

    TutorialModule.addInitializer(function () {

        var self = this;

        TutorialModule.addRegions({
            content: '#content',
            overlay: '#overlay'
        });

        this.project = null;
        this.tutorial = null;
        this.currentStepIndex = 0;

        this.defaultNextStepDelayMillis = 50; // Low value by default; just allow usual click event handler to run first
        this.nextStepDelayMillis = this.defaultNextStepDelayMillis;

        Communicator.reqres.setHandler( 'tutorial', function () {
            return self.tutorial;
        });

    });

    TutorialModule.show = function(tutorialId) {

        this.tutorialId = tutorialId;

        Communicator.mediator.on('tutorial:onStep', this.updateOnStepChange, this);
        Communicator.mediator.on('tutorial:nextStep', this.nextStep, this);
        Communicator.mediator.on('tutorial:previousStep', this.previousStep, this);
        Communicator.mediator.on('tutorial:end', this.close, this);
        Communicator.mediator.on('project:close', this.close, this);

        Communicator.mediator.on('tutorials:fetched', this.onTutorialsFetched, this);
        Communicator.command.execute('tutorials:fetch');

    };

    TutorialModule.close = function() {

        if( this.tutorialView ) {
            this.tutorialView.close();
        }

        this.project = null;
        this.tutorial = null;
        this.currentStepIndex = 0;

        this.removeHighlights();

        $('#ide').removeClass('disable-input');

        Communicator.mediator.off('tutorial:onStep', this.updateOnStepChange, this);
        Communicator.mediator.off('tutorial:nextStep', this.nextStep, this);
        Communicator.mediator.off('tutorial:previousStep', this.previousStep, this);
        Communicator.mediator.off('tutorial:end', this.close, this);
        Communicator.mediator.off('project:close', this.close, this);

        Communicator.mediator.off('tutorials:fetched', this.onTutorialsFetched, this);
        Communicator.mediator.off('project:shown:edit', this.renderTutorial, this);

    };

    TutorialModule.onTutorialsFetched = function(tutorialCollection) {

        this.tutorial = tutorialCollection.get( this.tutorialId );

        this.tutorialView = new TutorialView({ model: this.tutorial });
        this.currentStepIndex = 0;

        this.project = Communicator.reqres.request('project');

        if( this.project && this.project.isLoaded() ) {
            this.renderTutorial();
        } else {

            // Wait until we have finished showing the stage, otherwise we have the strange problem with Tutorial 3
            // whereby the scene events seem to be firing, but we don't actually see any animation...
            Communicator.mediator.once('project:shown:edit', this.renderTutorial, this);

        }

    };

    TutorialModule.renderTutorial = function() {

        TutorialModule.overlay.show( this.tutorialView );

        $('#ide').addClass('disable-input');

        this.updateOnStepChange();

    };

    TutorialModule.previousStep = function() {

        if( !this.tutorial ) {
            return;
        }

        if( this.currentStepIndex > 0 ) {
            this.currentStepIndex = this.currentStepIndex - 1;
            Communicator.mediator.trigger('tutorial:onStep', this.currentStepIndex);
        }
    };

    TutorialModule.hideStep = function() {

        this.tutorialView.hideStep();

    };

    TutorialModule.nextStep = function() {

        var user;

        if( !this.tutorial ) {
            return;
        }

        if( this.currentStepIndex < this.tutorial.get('steps').length - 1) {

            this.currentStepIndex = this.currentStepIndex + 1;
            Communicator.mediator.trigger('tutorial:onStep', this.currentStepIndex);

        } else {

            // Finished this tutorial

            user = Communicator.reqres.request('user');
            user.setTutorialCompleted(this.tutorial.get('level'), this.tutorial.get('number'));

            // Null means save all attributes...
            user.save(null, {
                success: function() {
                    TutorialModule.closeProject(true);
                },
                error: function(err) {
                    console.log('Error saving user', err);
                    TutorialModule.closeProject();
                }
            });

        }

    };

    TutorialModule.closeProject = function( tutorialIsCompleted ) {

        // This will trigger our own close method and also go back to the tutorials list
        Communicator.mediator.trigger('project:close', tutorialIsCompleted);

    };

    TutorialModule.updateOnStepChange = function() {

        var tutorialStep;

        if( !this.tutorial ) {
            return;
        }

        tutorialStep = this.tutorial.get('steps')[this.currentStepIndex];

        this.setNextStepDelay( tutorialStep.nextStepDelay );
        this.highlight( tutorialStep.highlight );
        this.runInitActions( tutorialStep.initActions );
        this.setupActionToProceed( tutorialStep.actionToProceed );
        this.updateEnabledElements( tutorialStep.enableInput, tutorialStep.actionToProceed );

        this.tutorialView.showStep( this.currentStepIndex );

    };

    /**
     * FIXME Technically anything using JQuery and referencing the DOM should probably be in a View instead?
     */
    TutorialModule.highlight = function( highlight ) {

        $('.highlight').removeClass('highlight');

        if( highlight ) {

            if( highlight.dom ) {

                $(highlight.dom).addClass('highlight');

            } else if( highlight.stage ) {

                // TODO stage object highlights

            }


        }
    };

    TutorialModule.removeHighlights = function() {

        this.highlight( null );

    };

    TutorialModule.runInitActions = function( initActions ) {

        var self = this;

        if( !initActions ) {
            return;
        }

        var doRunInitActions = function() {

            self.addEvents( initActions.addEvents );
            self.removeEvents( initActions.removeEvents );
            self.setMode( initActions.setMode );

        };

        // If project hasn't loaded yet, wait until it's ready first...
        if( this.project.isLoaded() ) {
            doRunInitActions();
        } else {
            // Run init actions after project is loaded
            this.project.once('sync', doRunInitActions);
        }

    };

    TutorialModule.setupActionToProceed = function( actionToProceed ) {

        var self = this,
            entityCollection = Communicator.reqres.request('entities'),
            type,
            callNextStep,
            callNextStepAndUnbind,
            checkSelectedEntity,
            checkUpdatedEntity;

        if( !actionToProceed ) {
            return;
        }

        type = actionToProceed.type;

        callNextStep = function() {

            // Hide the current step straight away
            self.hideStep();

            setTimeout(function() {
                self.nextStep();
            }, self.nextStepDelayMillis);

        };

        switch( type ) {

            /** Selecting - i.e. clicking **/
            case 'select':

                if( actionToProceed.element ) {

                    // DOM element
                    $(actionToProceed.element).one('click', callNextStep);

                } else if( actionToProceed.object ) {

                    // Stage element

                    checkSelectedEntity = function(id, eventName) {

                        // For the edit mode event we know we've selected something
                        // For the play mode event, we need to check it's a click event
                        if( actionToProceed.object === id && (!eventName || eventName === 'onClick') ) {

                            callNextStep();

                            Communicator.mediator.off('entity:selected', checkSelectedEntity);

                            if( entityCollection ) {
                                entityCollection.off('sceneEvent', checkSelectedEntity);
                            }
                        }

                    };

                    // Edit mode
                    Communicator.mediator.on('entity:selected', checkSelectedEntity, this);

                    // Play mode
                    if( entityCollection ) {
                        entityCollection.on('sceneEvent', checkSelectedEntity, this);
                    }

                }

                break;

            /** i.e. Change select input **/
            case 'change':

                if( actionToProceed.element ) {

                    callNextStepAndUnbind = function() {
                        callNextStep();
                        $(actionToProceed.element).unbind('change', callNextStep);
                    };

                    $(actionToProceed.element).change( callNextStepAndUnbind );

                }

                break;

            /** i.e. Object property update **/
            case 'update':

                // TODO check which property has been updated

                if( actionToProceed.object ) {

                    checkUpdatedEntity = function(id) {

                        if( actionToProceed.object === id ) {
                            callNextStep();
                            Communicator.mediator.off('entity:updated', checkUpdatedEntity);
                        }

                    };

                    // Listen for the update event
                    Communicator.mediator.on('entity:updated', checkUpdatedEntity, this);

                }

        }

    };

    TutorialModule.updateEnabledElements = function(enableInput, actionToProceed) {

        $('.enable-input').removeClass('enable-input');

        if( enableInput ) {

            if( enableInput.dom ) {

                $(enableInput.dom).addClass('enable-input');

            } else if( enableInput.stage ) {

                $('#stage-canvas').addClass('enable-input');

                // TODO set which actual objects can be interacted with
            }

        }

        // We also enable by default the actionToProceed.element and the actionToProceed.object if type === 'select'
        if( actionToProceed ) {

            if( actionToProceed.element ) {

                $(actionToProceed.element).addClass('enable-input');

            } else if( actionToProceed.object && actionToProceed.type === 'select' ) {

                $('#stage-canvas').addClass('enable-input');

                // TODO set which actual objects can be interacted with

            }

        }

    };

    TutorialModule.setMode = function( mode ) {

        if( mode === 'play' || mode === 'edit' ) {
            Communicator.mediator.trigger( 'ide:mode:' + mode );
        }

    };

    TutorialModule.addEvents = function( addEvents ) {

        var entities = Communicator.reqres.request('entities'),
            entity,
            addEvent,
            eventItem,
            existing,
            targetEntity,
            targetMethod;

        if( addEvents ) {

            for( var i=0; i < addEvents.length; i++ ) {

                addEvent = addEvents[i];

                eventItem = null;

                entity = entities.get(addEvent.entity);

                if( entity ) {
                    eventItem = entity.get('events').findWhere({name: addEvent.event});
                }

                if( eventItem ) {

                    // Add listener if it doesn't already exist

                    targetEntity = addEvent.targetEntity;
                    targetMethod = addEvent.targetMethod;

                    existing = eventItem.get('listeners').filter(function(item) {
                        return item.get('entity_id') === targetEntity &&
                            item.get('method_name') === targetMethod;
                    }, this);

                    if( existing.length < 1 ) {
                        eventItem.get('listeners').add(new EventListenerModel({
                            entity_id: addEvent.targetEntity,
                            method_name: addEvent.targetMethod
                        }));
                    }

                }

            }

        }

    };

    TutorialModule.removeEvents = function( removeEvents ) {

        var entities = Communicator.reqres.request('entities'),
            removeEvent;

        if( removeEvents ) {

            for( var i=0; i < removeEvents.length; i++ ) {

                removeEvent = removeEvents[i];

                entities.each(function(entity) {

                    if( removeEvent.entity === entity.get('id') ) {

                        entity.get('events').each(function(event) {
                            if( removeEvent.event === event.get('name') ) {
                                // Clear the listeners for this event
                                event.get('listeners').reset();
                            }
                        });
                    }

                });

            }

        }

    };

    TutorialModule.setNextStepDelay = function(nextStepDelay) {

        this.nextStepDelayMillis = nextStepDelay ? nextStepDelay : this.defaultNextStepDelayMillis;

    };

    return TutorialModule;

});
