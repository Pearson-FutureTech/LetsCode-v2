/*global document*/

/**
 * Not currently used.
 */
define([], function() {

    'use strict';

    var FullScreen = {

        /**
         * Based on: https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
         */
        toggleFullScreen: function() {

            var switchingOn;

            if (!document.fullscreenElement &&    // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }

                switchingOn = true;

            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }

                switchingOn = false;
            }

            return switchingOn;

        }

    };

    return FullScreen;

});