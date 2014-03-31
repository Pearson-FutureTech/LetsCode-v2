/**
 * 'Base class' (or 'super view') for EntityEditView and EntityPlayView.
 */
define([
    'underscore',
    'easel',
    'backbone.marionette'
], function(
    _,
    createjs,
    Marionette
) {

    'use strict';

    return Marionette.View.extend({

        initialize: function(options) {
            this.dispatcher = options.dispatcher;
            this.stage = options.stage;
            this.render();
        },

        modelEvents: {
            'change': 'handleChange'
        },

        handleChange: function() {
            this.update();
        },

        update: function() {
            this.container.x = this.model.getPropertyValue('left');
            this.container.y = this.model.getPropertyValue('top');
        },

        render: function() {
            var spriteSheet,
                sprite,
                container;

            spriteSheet = new createjs.SpriteSheet(this.model.getPropertyValue('sprite'));
            sprite = new createjs.Sprite(spriteSheet);
            sprite.name = 'sprite';

            this.container = container = new createjs.Container();
            container.x = this.model.getPropertyValue('left');
            container.y = this.model.getPropertyValue('top');

            container.addChild(sprite);

            this.stage.addChild(container);

            /**
             * TODO For configurable button text, look for an 'init' method that we should run straight away?
             * But how will we run it here, where we don't have access to the proxyEntity?
             */

        },

        onClose: function() {
            this.stage.removeChild(this.container);
        }

    });
});
