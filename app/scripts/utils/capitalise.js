define([],function(){

    'use strict';

    var capitalise = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return capitalise;
});
