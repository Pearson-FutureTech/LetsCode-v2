/*jshint undef:false */
/**
 * For debugging variables in Handlebars
 * Usage: {{#debug myObject}}{{/debug}}
 */
define('template/helpers/debug', ['handlebars'], function( Handlebars ) {
    /*jshint validthis:true */

    'use strict';

    function debug(value) {

        console.log( '* Handlebars Current Context:', this);
        console.log( '* Handlebars Value', value );

    }

    Handlebars.registerHelper('debug', debug);

    return debug;
});