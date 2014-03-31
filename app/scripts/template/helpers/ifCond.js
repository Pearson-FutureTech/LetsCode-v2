/**
 * Allow logical operators in if conditions - thanks to:
 * http://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional
 */
define('template/helpers/ifCond', ['handlebars'], function( Handlebars ) {

    'use strict';

    function ifCond(v1, operator, v2, options) {

        /*jshint validthis:true */
        switch (operator) {
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
        
    }

    Handlebars.registerHelper('ifCond', ifCond);

    return ifCond;

});