/*global describe,beforeEach,sinon,it,expect*/
/*jshint expr:true*/

define([
    'squire',
    'collections/project/property_collection',
    'models/project/entity_model',
    'models/project/property_model',
    'views/stage/entity_view'
], function(
    Squire,
    PropertyCollection,
    EntityModel,
    PropertyModel,
    EntityView
) {

    'use strict';

    var fakeEasel,
        fakeSpriteSheet,
        fakeContainer,
        fakeEntityModel,
        fakeStage,
        fakeSpriteProperty;

    fakeContainer = {
        addChild: sinon.stub(),
        on: sinon.stub()
    };

    fakeSpriteSheet = {name: 'sprite', value: 'foo'};

    fakeSpriteProperty = new PropertyModel(fakeSpriteSheet);

    fakeEntityModel = new EntityModel({
        'name': 'foo',
        'default_instance_id': 'myFoo',
        'properties': new PropertyCollection([fakeSpriteProperty])
    });

    fakeEasel = {
        SpriteSheet: function() { return fakeSpriteSheet; },
        Sprite: sinon.stub(),
        Container: sinon.stub().returns(fakeContainer)
    };

    fakeStage = {
        addChild: sinon.stub()
    };

    describe('EntityView', function() {

        describe('when initialized', function() {

            var entityView;
            var injector = new Squire();
            injector.mock('easel', fakeEasel);

            beforeEach(function() {
                fakeStage.addChild.reset();

                entityView = new EntityView({
                    model: fakeEntityModel,
                    stage: fakeStage
                });
            });

            it('should add itself to the stage', function() {
                expect(
                    fakeStage.addChild.calledOnce
                ).to.be.true;
            });

        });

    });


});
