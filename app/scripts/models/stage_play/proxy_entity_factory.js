/*jshint evil:true,unused:false*/

/**
 * Used for the actual 'runnable' objects that we manipulate on the stage when we play a project.
 */
define([
    'backbone',
    'underscore',
    'easel',
    'utils/capitalise',
    'tween'
], function(
    Backbone,
    _,
    createjs,
    capitalise
) {

    'use strict';

    var ProxyEntityFactory = function() {
    };

    /*
     * Should we be wrapping the view like this? Perhaps we should try updating the properties on the models
     * (or copies of the models - we don't want to accidentally save them during Play - animations should be discarded),
     * and have the view automatically update because of that?
     */
    ProxyEntityFactory.prototype.create = function(entity, entityViewContainer) {
        var proxyEntity,
            complete,
            playAnimations,
            getCurrentTween,
            triggerEvent,
            animate,
            entityProperties = {};

        // Entity properties are exposed to the 'user' code (as long as they're not 'hidden')
        entity.get('properties').each(function(property) {
            if( !property.get('hidden') ) {
                entityProperties[ property.get('name') ] = property.get('value');
            }
        });

        complete = function(name) {
            triggerEvent('on' + capitalise(name) + 'End');
        };

        playAnimations = function(callback) {
            if (!_.isEmpty(proxyEntity.tweens)) {
                animate(callback);
            }
        };

        triggerEvent = function(eventName) {
            entity.collection.trigger('sceneEvent', entity.get('id'), eventName);
        };

        animate = function(callback) {
            callback = callback || function() {};

            proxyEntity.tweens.forEach(function(tween, index) {
                var createjsTween;

                createjsTween = createjs.Tween.get(entityViewContainer);

                if ('delay' in tween) {
                    createjsTween.wait(tween.delay);
                }

                createjsTween.to(tween.properties, tween.duration || 0, tween.ease);

                if (index === proxyEntity.tweens.length - 1) {
                    createjsTween.call(callback);
                }
            });
        };

        getCurrentTween = function() {

            if (typeof proxyEntity.tweens[proxyEntity.currentTweenIndex] !== 'object') {
                proxyEntity.tweens[proxyEntity.currentTweenIndex] = {
                    properties: {}
                };
            }

            return proxyEntity.tweens[proxyEntity.currentTweenIndex];
        };

        /**
         * The properties and methods here are exposed to the 'user' code
         */
        proxyEntity = {

            properties: entityProperties,

            tweens: [],

            currentTweenIndex: 0,

            move: function(properties) {
                var currentTween;

                this.currentTweenIndex = this.tweens.length;
                currentTween = getCurrentTween();

                if( !('x' in properties) && !('y' in properties) ) {
                    throw new Error('You need to call move with an \'x\' and/or \'y\' property');
                }

                if( 'x' in properties ) {
                    currentTween.properties.x = entityViewContainer.x + properties.x;
                }

                if( 'y' in properties ) {
                    currentTween.properties.y = entityViewContainer.y + properties.y;
                }

                return this;
            },

            moveOnPath: function(properties) {
                var currentTween,
                    relativeCoordinates,
                    x,
                    y;

                this.currentTweenIndex = this.tweens.length;
                currentTween = getCurrentTween();

                if (!Array.isArray(properties)) {
                    throw new Error('You need to call moveOnPath with an Array');
                }

                if(properties.length % 2 === 0 || properties.length < 3) {
                    throw new Error('You need to call moveOnPath with an odd number of co-ordinates (and at least 3)');
                }

                relativeCoordinates = [];

                x = entityViewContainer.x;
                y = entityViewContainer.y;

                properties.forEach(function(coordinatePair) {
                    x = x + coordinatePair.x;
                    y = y + coordinatePair.y;

                    relativeCoordinates.push(x);
                    relativeCoordinates.push(y);
                });

                currentTween.properties.guide = {
                    path: relativeCoordinates
                };

                return this;
            },

            // TODO make number of path points (a.k.a. steps) dynamically - currently always 5
            parabola: function(properties) {

                var totalX = properties.x,
                    totalY = properties.y,
                    steps = 5,
                    stepX = totalX / steps,
                    stepY = totalY / steps;

                if( !('x' in properties) || !('y' in properties) ) {
                    throw new Error('You need to call parabola with an \'x\' and \'y\' property');
                }

                return this.moveOnPath([{x: 0, y: 0}, {x: stepX, y: -stepY}, {x: stepX, y: -stepY / 2}, {x: stepX, y: 0}, {x: stepX, y: stepY / 2}, {x: stepX, y: stepY}, {x: 0, y: 0}]);

            },

            delay: function(delayInSeconds) {
                var currentTween = getCurrentTween();

                if (_.isEmpty(currentTween.properties)) {
                    throw new Error('You need to have called move() before setting a delay');
                }

                currentTween.delay = delayInSeconds * 1000;

                return this;
            },

            duration: function(durationInSeconds) {
                var currentTween = getCurrentTween();

                if (_.isEmpty(currentTween.properties)) {
                    throw new Error('You need to have called move() before specifying a duration');
                }

                currentTween.duration = durationInSeconds * 1000;

                return this;
            },

            accelerate: function() {
                var currentTween = getCurrentTween();

                if (_.isEmpty(currentTween.properties)) {
                    throw new Error('You need to have called move() before specifying accelerate');
                }

                currentTween.ease = createjs.Ease.quadIn;

                return this;
            },

            decelerate: function() {

                var currentTween = getCurrentTween();

                if (_.isEmpty(currentTween.properties)) {
                    throw new Error('You need to have called move() before specifying decelerate');
                }

                currentTween.ease = createjs.Ease.quadOut;

                return this;
            },

            animate: function(animationName) {
                var sprite = entityViewContainer.getChildByName('sprite');

                sprite.gotoAndPlay(animationName);
            },

            writeText: function(string, relativeX, relativeY, font, color) {

                // Replace previous text if we already wrote some
                // Storing in properties because otherwise variables here get lost each time we run a method!
                if( this.properties.text ) {
                    entityViewContainer.removeChild(this.properties.text);
                }

                this.properties.text = new createjs.Text(string, font || '15px Arial', color || '#000000');
                this.properties.text.x = relativeX ? relativeX : 0;
                this.properties.text.y = relativeY ? relativeY : 0;
                this.properties.text.textBaseline = 'alphabetic';

                entityViewContainer.addChild(this.properties.text);

            },

            // Allow the method code to trigger events
            trigger: function(eventName) {
                triggerEvent(eventName);
            },

            run: function(name, code, sourceEntityView) {

                /**
                 * FIXME Proper security for user code (before we allow method code to be edited by end users).
                 * The aim of this bit is to protect some of the global namespace, although this definitely isn't
                 * bulletproof. This needs a lot more thought. It's OK just for now though, because methods cannot
                 * currently be edited by end users.
                 */
                var entity = null,
                    entityViewContainer = null,
                    window = null,
                    location = null,
                    document = null;

                /**
                 * Properties of the 'calling' (or 'source') entity are exposed to the eval'd code.
                 * This allows the entity running the code to check properties of the entity that called the method.
                 * (E.g. allows the scoreboard to check the position of the athlete).
                 */
                var caller = {};

                sourceEntityView.model.get('properties').each(function(property) {
                    if( !property.get('hidden') ) {
                        caller[ property.get('name') ] = property.get('value');
                    }
                });

                /**
                 * The left and top values from the model properties won't be up to date if we've performed a move
                 * animation, so override with the current values from the easeljs container. (Keep them called 'left'
                 * and 'top' for user comprehension).
                 */
                caller.left = sourceEntityView.container.x;
                caller.top = sourceEntityView.container.y;

                // Hide the rest from the eval'd code
                sourceEntityView = null;

                // Now, execute the method.
                eval(code);

                playAnimations(function() {
                    complete(name);
                });
            }

        };

        return proxyEntity;
    };

    return ProxyEntityFactory;
});
