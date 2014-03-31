/*global define:true*/

/**
 * For displaying tutorial steps.
 */
define([
    'underscore',
    'jquery',
    'communicator',
    'backbone',
    'utils/entity_utils',
    'hbs!tmpl/view/tutorial_tmpl'
], function(
    _,
    $,
    Communicator,
    Backbone,
    EntityUtils,
    TutorialTmpl
    ) {

    'use strict';

    return Backbone.Marionette.ItemView.extend({

        initialize: function() {

            $(window).on('resize', {context: this}, this.onWindowResize);
            Communicator.mediator.on('stage:scrolled', this.repositionStep, this);

        },

        onClose: function() {

            $(window).off('resize', this.onWindowResize);
            Communicator.mediator.off('stage:scrolled', this.repositionStep, this);

        },

        template: {
            type: 'handlebars',
            template: TutorialTmpl
        },

        events: {
            'click .continue': 'nextStep'
        },

        nextStep: function() {
            Communicator.mediator.trigger('tutorial:nextStep');
        },

        hideStep: function() {
            $('li', this.$el).hide();
        },

        showStep: function(stepIndex) {

            this.tutorialStep = this.model.get('steps')[stepIndex];

            if( !this.tutorialStep ) {
                return;
            }

            this.hideStep();
            this.$stepEl = $('.tutorial-steps > li:eq('+ stepIndex + ')', this.$el);
            this.$stepEl.show();

            if( this.isTargetBasedPositioning() ) {
                this.positionNextToTarget();
            }

        },

        isTargetBasedPositioning: function() {

            return this.tutorialStep && this.tutorialStep.arrowDirection && this.tutorialStep.highlight &&
                (this.tutorialStep.highlight.dom || this.tutorialStep.highlight.stage);

        },

        onWindowResize: function(event) {
            if( event.data.context ) {
                event.data.context.repositionStep();
            }
        },

        repositionStep: function() {
            if( this.isTargetBasedPositioning() ) {
                this.positionNextToTarget();
            }
        },

        positionNextToTarget: function() {

            var targetSelector = this.tutorialStep.highlight.dom,
                $targetEl = targetSelector ? $(targetSelector) : null,
                targetEntityId = this.tutorialStep.highlight.stage,
                targetPositionProps = null;

            if( $targetEl && $targetEl.length > 0 ) {

                targetPositionProps = {
                    left: $targetEl.offset().left,
                    top: $targetEl.offset().top,
                    width: $targetEl.width(),
                    height: $targetEl.height()
                };

            } else if( targetEntityId ) {

                targetPositionProps = EntityUtils.getEntityPositionProps( targetEntityId );

            }

            if( targetPositionProps ) {

                var targetLeft = targetPositionProps.left,
                    targetRight = targetLeft + targetPositionProps.width,
                    targetHCentre = targetLeft + (targetPositionProps.width / 2),
                    targetTop = targetPositionProps.top,
                    targetBottom = targetTop + targetPositionProps.height,
                    targetVCentre = targetTop + (targetPositionProps.height / 2),
                    $stepContentEl = $('.content', this.$stepEl),
                    stepElWidth = this.$stepEl.width(),
                    stepElHeight = this.$stepEl.height(),
                    windowWidth = $(window).width(),
                    arrowLength = 45,
					arrowXthreshold = 50, // x overlap threshold for when to adjust the arrow position
                    leftPx,
                    topPx;

                switch( this.tutorialStep.arrowDirection ) {

                    case 'top':
                        // NB. Child element is positioned 50% left for centering purposes...
                        leftPx = targetHCentre;
                        topPx = targetBottom + arrowLength;

                        break;

                    case 'bottom':
                        leftPx = targetHCentre;
                        topPx = targetTop - arrowLength - stepElHeight;

                        break;

                    case 'left':
                        leftPx = (targetRight + arrowLength + (stepElWidth / 2));
                        topPx = (targetVCentre - (stepElHeight / 2));

                        break;

                    case 'right':
                        leftPx = (targetLeft - arrowLength - (stepElWidth / 2));
                        topPx = (targetVCentre - (stepElHeight / 2));

                        break;

                }

                // Now check we're not going to be clipped at the edge of the screen (just checking left and right for
                // now). If so, won't work for all cases, but adjust the position of the arrow to be in the corner...
                if( leftPx < 0 ) {

                    if( (leftPx < -arrowXthreshold ) &&
						($stepContentEl.hasClass('arrow-top') || $stepContentEl.addClass('arrow-bottom')) ) {
                        $stepContentEl.addClass('arrow-left-corner');
                    }
					leftPx = 0;

				} else if( leftPx > windowWidth - stepElWidth / 2 ) {
                    // Container is positioned half the bubble width to the right of the actual bubble

					if( (leftPx - arrowXthreshold > windowWidth - stepElWidth / 2 ) &&
						($stepContentEl.hasClass('arrow-top') || $stepContentEl.addClass('arrow-bottom')) ) {
                        $stepContentEl.addClass('arrow-right-corner');
                    }
					leftPx = windowWidth - stepElWidth / 2;
                }

                this.$stepEl.css('left', leftPx);
                this.$stepEl.css('top', topPx);

            }

        },

        serializeData: function() {

            return {
                tutorial: this.model.toJSON(),
                lastStepIndex: this.model.get('steps').length - 1
            };
        }

    });

});
