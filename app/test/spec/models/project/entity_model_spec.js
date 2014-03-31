/*global describe,it,before*/
/*jshint expr:true*/

define([
    'squire',
    'models/project/entity_model',
    'collections/project/property_collection',
    'models/project/property_model'
], function(
    Squire,
    EntityModel,
    PropertyCollection,
    PropertyModel
) {

    'use strict';

    var fakeEntityModel = new EntityModel({
        'name': 'foo',
        'default_instance_id': 'myFoo',
        'properties': new PropertyCollection()
    });

    var propertiesData = [
        {
            name: 'left',
            value: 1,
            type: 'int'
        },
        {
            name: 'width',
            value: 100,
            type: 'int'
        }
    ];

    describe('EntityModel', function() {

        before(function() {
            for( var i=0; i < propertiesData.length; i++ ) {
                fakeEntityModel.get('properties').add( new PropertyModel( propertiesData[i] ) );
            }
        });

        it('should have the right name', function() {
            fakeEntityModel.get('name').should.equal('foo');
        });

        it('should assign the id based on the default_instance_id', function() {
            fakeEntityModel.get('id').should.equal('myFoo');
        });

        it('should have the right number of properties', function() {
            fakeEntityModel.get('properties').length.should.equal( propertiesData.length );
        });

        it('should get the right value from getPropertyValue()', function() {
            fakeEntityModel.getPropertyValue('left').should.equal( 1 );
            fakeEntityModel.getPropertyValue('width').should.equal( 100 );
        });

        it('should set the property value using setPropertyValue()', function() {
            fakeEntityModel.setPropertyValue('left', 2);
            fakeEntityModel.getPropertyValue('left').should.equal( 2 );
        });

    });

});
