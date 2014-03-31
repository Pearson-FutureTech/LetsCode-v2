/*jshint camelcase:false*/
/* global alert */

/**
 * For the Events edit panel where we bind events to methods.
 */
define([
    'jquery',
    'communicator',
    'backbone.marionette',
    'models/project/event_listener_model',
    'hbs!tmpl/view/editor/events_binding_template'
], function(
    $,
    Communicator,
    Marionette,
    EventListenerModel,
    eventsBindingTemplate
) {

    'use strict';

    var EventsBindingView = Marionette.ItemView.extend({
        template: {
            type: 'handlebars',
            template: eventsBindingTemplate
        },

        events: {
            'change [data-element="trigger-event"]': 'onChangeTriggerEvent',
            'change [data-element="target-entity"]': 'onChangeTargetEntity',
            'click [data-element="add"]': 'onClickAdd',
            'click [data-element="remove"]': 'onClickRemove'
        },

        modelEvents: {
            'change': 'onModelChange'
        },

        ui: {
            triggerEvent: '[data-element="trigger-event"]',
            targetEntity: '[data-element="target-entity"]',
            targetMethod: '[data-element="target-method"]'
        },

        onShow: function() {

            Communicator.mediator.on('entity:selected', this.render, this);
            Communicator.mediator.on('event:selected', this.highlightSelectedTriggerEvent, this);

        },

        onClose: function() {

            Communicator.mediator.off('entity:selected', this.render, this);
            Communicator.mediator.off('event:selected', this.highlightSelectedTriggerEvent, this);

        },

        onModelChange: function() {
            this.render();
        },

        onRender: function() {
            this.highlightSelectedTriggerEvent();
            this.renderTargetMethods();
        },

        highlightSelectedTriggerEvent: function() {

            var ideModel = Communicator.reqres.request('ide:model'),
                selectedEventName = ideModel.getSelectedEventName();

            if( this.ui.triggerEvent.find ) {

                this.ui.triggerEvent.find('option').removeAttr('selected');

                if( selectedEventName ) {
                    this.ui.triggerEvent.find('option[value="' + selectedEventName + '"]').attr('selected', 'selected');
                }
            }

        },

        isListenerTheSame: function(listenerItem, targetEntity, targetMethod) {

            return listenerItem.get('entity_id') === targetEntity &&
                listenerItem.get('method_name') === targetMethod;

        },

        onClickAdd: function() {

            var ideModel = Communicator.reqres.request('ide:model'),
                eventItem,
                listener,
                sameListeners,
                selectedEventName = ideModel.getSelectedEventName();

            eventItem = this.model.get('events').findWhere({name: selectedEventName});

            listener = new EventListenerModel({
                    entity_id: this.getTargetEntityId(),
                    method_name: this.getTargetMethodName()
                });

            sameListeners = eventItem.get('listeners').filter(function(item) {
                return this.isListenerTheSame(item, this.getTargetEntityId(), this.getTargetMethodName());
            }, this);

            if( sameListeners.length < 1 ) {

                eventItem.get('listeners').add( listener );
                this.render();

            } else {
                // TODO replace alert
                alert('You can only add each binding once!');
            }

        },

        onClickRemove: function(e) {

            var $target = $(e.target),
                triggerEventName = $target.attr('data-event'),
                targetEntityId = $target.attr('data-target'),
                targetMethodName = $target.attr('data-method'),
                eventItem = this.model.get('events').findWhere({name: triggerEventName}),
                listenerItem;

            listenerItem = eventItem.get('listeners').findWhere({entity_id: targetEntityId, method_name: targetMethodName});

            if( listenerItem ) {
                eventItem.get('listeners').remove( listenerItem );
                this.render();
            }

        },

        onChangeTriggerEvent: function() {
            var triggerEventName = this.ui.triggerEvent.find('option:selected').val();
            Communicator.mediator.trigger('event:selected', triggerEventName);
        },

        onChangeTargetEntity: function() {
            this.renderTargetMethods();
        },

        getTargetEntityId: function() {
            return this.ui.targetEntity.find('option:selected').val();
        },

        getTargetMethodName: function() {
            return this.ui.targetMethod.find('option:selected').val();
        },

        serializeData: function() {
            return {
                bindings: this.getBindings(),
                triggerEntity: this.model ? this.model.toJSON() : null,
                triggerEvents: this.model ? this.model.get('events').toJSON() : null,
                targetEntities: this.getTargetEntities()
            };
        },

        getBindings: function() {

            var self = this,
                bindings = [];

            if( this.model ) {

                this.model.get('events').each(function(event) {

                    var eventName = event.get('name');

                    if( event.get('listeners') ) {

                        event.get('listeners').each(function(listener) {
                            bindings.push({
                                triggerEntityId: self.model.get('id'),
                                triggerEvent: eventName,
                                targetEntity: listener.get('entity_id'),
                                targetMethod: listener.get('method_name')
                            });
                        });
                    }

                });

            }
            return bindings;
        },

        getTargetEntities: function() {

            var entities = Communicator.reqres.request('entities');

            return entities.filter(function(item) {
                return item.get('name') !== 'Scene';
            });

        },

        getTargetMethods: function() {

            var project = Communicator.reqres.request('project');

            var targetEntityId = this.getTargetEntityId(),
                entity = project.getEntity(targetEntityId),
                targetMethods = [];

            if( entity && entity.get('methods') ) {

                // TODO would be nice to have this as a convenience method on the model
                targetMethods = entity.get('methods').filter(function(item) {
                    return !item.get('hidden');
                });
            }

            return targetMethods;

        },

        renderTargetMethods: function() {

            var $targetMethod = this.ui.targetMethod;

            $targetMethod.empty();

            var targetMethods = this.getTargetMethods();

            if( targetMethods ) {
                targetMethods.forEach(function(item) {
                    $targetMethod.append(
                        '<option value="' + item.get('name') + '">' + item.get('name') + '</option>'
                    );
                });
            }

        }

    });

    return EventsBindingView;

});
