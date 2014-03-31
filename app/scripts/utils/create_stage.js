define([
    'easel'
], function(
    // EaselJS, and some of it's sister libraries tie everything to createjs
    createjs
) {

    'use strict';

    /**
     * Create an easeljs stage and a DOM element to go with it
     */
    var createStage = function(options) {

        var stageEl = document.createElement('canvas'),
            stage;

        stageEl.setAttribute('id', options.id);
        stageEl.setAttribute('width', options.width);
        stageEl.setAttribute('height', options.height);
        stageEl.setAttribute('class', options.class);

        stage = new createjs.Stage(stageEl);
        stage.enableMouseOver();

        // We may want to enable this for adding touch support
        //createjs.Touch.enable(stage);
        
        return stage;
    };

    return createStage;

});
