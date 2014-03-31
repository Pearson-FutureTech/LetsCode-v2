/**
 * We use Flash for the Copy button in the Project share dropdown.
 * Utility based on https://gist.github.com/getify/675496
 */
(function(window,navigator) {

    'use strict';

    function hasNavigatorPlugin() {
        return (typeof navigator.plugins !== 'undefined' &&
                typeof navigator.plugins['Shockwave Flash'] === 'object');
    }

    function hasActiveXPlugin() {

        return (typeof window.ActiveXObject !== 'undefined' &&
                (new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash')) !== false);
    }

    if (window.Modernizr) {
        if (!window.Modernizr.flash) {
            window.Modernizr.flash = hasNavigatorPlugin() || hasActiveXPlugin();
        }
    }

}(window, navigator));
