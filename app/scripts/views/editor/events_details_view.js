/*global define:true*/
/*jshint camelcase:false*/

/**
 * For the Events panel when we're listing the events for an object.
 */
define([
    'jquery',
	'communicator',
	'backbone.marionette',
	'hbs!tmpl/view/editor/events_details_template'
], function(
    $,
	Communicator,
	Marionette,
	eventsDetailsTemplate
) {

	'use strict';

	var EventsDetailsView = Marionette.ItemView.extend({
		template: {
			type: 'handlebars',
			template: eventsDetailsTemplate
		},

		initialize: function() {
			Communicator.mediator.on( 'entity:selected', this.render, this );
		},

        events: {
            'click .event': 'onClickEvent'
        },

        modelEvents: {
			'change': 'onModelChange'
		},

        onModelChange: function() {
            this.render();
		},

		serializeData: function() {
			return {
				events: this.model ? this.model.get('events').toJSON() : null,
				entityId: this.model ? this.model.get('id') : null
			};
		},

        onClickEvent: function(e) {

            var $el = $(e.currentTarget),
                eventName = $el.data('event');

            Communicator.mediator.trigger( 'event:selected', eventName );

        }

	});

	return EventsDetailsView;

});
