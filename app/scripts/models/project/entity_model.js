/**
 * Model definition for entities, i.e. the object instances that are part of a project (e.g. an athlete).
 */
define([
    'backbone',
    'models/base_nestable_model',
    'collections/project/property_collection',
    'collections/project/method_collection',
    'collections/project/event_collection'
], function(
    Backbone,
    BaseNestableModel,
    PropertyCollection,
    MethodCollection,
    EventCollection
) {

    'use strict';

    return BaseNestableModel.extend({

        defaults: {
            properties: new PropertyCollection(),
            methods: new MethodCollection(),
            events: new EventCollection()
        },

        nestedModels: {
            'properties': PropertyCollection,
            'methods': MethodCollection,
            'events': EventCollection
        },

        /**
         * Initialize the Backbone ID attribute.
         */
        initialize: function() {

            this.updateId();

        },

        /**
         * Convenience method to pull out a particular property value from our PropertyCollection.
         */
        getPropertyValue: function(propertyName) {

            var property = this.get('properties').findWhere({name: propertyName}),
                value = null;

            if( property ) {
                value = property.get('value');
            }

            return value;

        },

        /**
         * Convenience method to set a particular property value in our PropertyCollection.
         */
        setPropertyValue: function(propertyName, propertyValue, skipIdUpdate) {

            var property = this.get('properties').findWhere({name: propertyName});

            if( property ) {
                property.set('value', propertyValue);
            }

            if( !skipIdUpdate && propertyName === 'id' ) {
                this.updateId();
            }

        },

        /**
         * Use the ID property defined on the object, if there is one, else just use the default instance id.
         * NB. If we enable editing of the ID property, then we would need to check if the ID is unique.
         */
        updateId: function() {

            var idProperty = this.getPropertyValue('id'),
                defaultInstanceId = this.get('default_instance_id');

            if( idProperty ) {

                this.set('id', idProperty);

            } else if( defaultInstanceId ) {

                this.set('id', defaultInstanceId);
                this.setPropertyValue('id', defaultInstanceId, true);

            }

        }

    });

});
