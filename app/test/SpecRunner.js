/* global mocha */
require.config({
    baseUrl: '../scripts/',
    urlArgs: 'cb=' + Math.random(),

    deps: ['backbone.marionette', 'marionette.handlebars'],

    shim: {

        fastclick: {
            exports: 'Fastclick'
        },

        ace: {
            exports: 'ace'
        },

        /* Foundation */
        foundation: ['jquery', 'fastclick'],
        'foundation.dropdown': ['foundation'],

        /* EaselJS */
        preload: ['easeljs'],
        easel: {
            exports: 'createjs'
        },
        tween: ['easel'],
        tweenMotionGuidePlugin: ['tween']
    },

    paths: {

        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone-amd/backbone',
        underscore: '../bower_components/underscore-amd/underscore',

        // alias all marionette libs
        'backbone.marionette': '../bower_components/backbone.marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/amd/backbone.wreqr',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/amd/backbone.babysitter',

        fastclick: '../bower_components/foundation/js/vendor/fastclick',

        /* alias the foundation js lib */
        foundation: '../bower_components/foundation/js/foundation/foundation',
        // Custom fork
        'foundation.dropdown': 'vendor/foundation.dropdown.letscode',

        /* Alias text.js for template loading and shortcut the template dir to tmpl */
        text: '../bower_components/requirejs-text/text',
        tmpl: 'template',

        /* handlebars from the require handlerbars plugin below */
        handlebars: '../bower_components/require-handlebars-plugin/Handlebars',

        /* require handlebars plugin - Alex Sexton */
        i18nprecompile: '../bower_components/require-handlebars-plugin/hbs/i18nprecompile',
        json2: '../bower_components/require-handlebars-plugin/hbs/json2',
        hbs: '../bower_components/require-handlebars-plugin/hbs',

        /* marionette and handlebars plugin */
        'marionette.handlebars': '../bower_components/backbone.marionette.handlebars/backbone.marionette.handlebars',

        // Sprites
        easel: '../bower_components/easeljs/lib/easeljs-0.7.0.min',
        tween: '../bower_components/createjs-tweenjs/lib/tweenjs-0.5.0.min',
        tweenMotionGuidePlugin: '../bower_components/createjs-tweenjs/src/tweenjs/MotionGuidePlugin',
        preload: 'vendor/preloadjs',

        ace: '../bower_components/ace-builds/src-min-noconflict/ace',
        'js_beautify': '../bower_components/js-beautify/js/lib/beautify',
        zeroclipboard: '../bower_components/zeroclipboard/ZeroClipboard',

        /*** Additions for testing only ***/
        squire: '../bower_components/squire/src/Squire'

    },

    hbs: {
        disableI18n: true
    }
});

/* require test suite */
require([
    'jquery',
    '../test/spec/testSuite'
],
function($, testSuite) {

    'use strict';

    // on dom ready require all specs and run
    $(function() {
        require(testSuite.specs, function() {

            if (window.mochaPhantomJS) {
                mochaPhantomJS.run();
            } else {
                mocha.run();
            }

        });
    });
});

