/**
 * Thanks to: http://stackoverflow.com/questions/18580495/format-a-date-from-inside-a-handlebars-template-in-meteor
 * If we need anything more complex later, consider replacing with Moment.js library
 */
define('template/helpers/formatDate', ['handlebars'], function( Handlebars ) {

    'use strict';

    var MONTH_STRINGS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    
    function formatDate(datetime) {

        var date = new Date(datetime);

        return date.getDate() + ' ' + MONTH_STRINGS[date.getMonth()] + ' ' + date.getHours() + ':' + date.getMinutes();

    }

    Handlebars.registerHelper('formatDate', formatDate);

    return formatDate;
});