/**
 * Layout for the overall app.
 */
define([
    'backbone.marionette',
    'hbs!tmpl/layout/application_template'
], function(
    Marionette,
    ApplicationTmpl
) {

    'use strict';

    return Marionette.Layout.extend({
   
        template: {
            type: 'handlebars',
            template: ApplicationTmpl
        }

    });

});