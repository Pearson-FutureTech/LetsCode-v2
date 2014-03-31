/*global describe,beforeEach,afterEach,sinon,it,expect*/
/*jshint expr:true*/

define([
    'views/header/project_view'
], function(
    ProjectView
) {

    'use strict';

    var projectView,
        projectViewOptions,
        fakeProjectModel,
        fakeProjectUrl;

    fakeProjectUrl = 'foobar';

    projectViewOptions = {
        isFlashEnabled: true
    };

    fakeProjectModel = {
        getShareUrl: sinon.stub().returns(fakeProjectUrl)
    };

    describe('ProjectView', function() {


        describe('#onShow', function() {

            describe('when isFlashEnabled is `true`', function() {

                var fakeCreateZeroClipboard,
                    fakeEventBinding;

                beforeEach(function() {
                    projectViewOptions.isFlashEnabled = true;

                    fakeCreateZeroClipboard = sinon.stub(
                        ProjectView.prototype,
                        'createZeroClipboard'

                    );

                    fakeEventBinding = sinon.stub();

                    fakeCreateZeroClipboard.returns({
                        on: fakeEventBinding
                    });

                    projectView = new ProjectView(projectViewOptions);
                    projectView.onShow();
                });

                afterEach(function() {
                    ProjectView.prototype.createZeroClipboard.restore();
                });

                it('should call #createZeroClipboard', function() {
                    expect(fakeCreateZeroClipboard.calledOnce).to.be.eq(true);
                });

                it('should call ZeroClipboard.on', function() {
                    expect(fakeEventBinding.calledWith(
                        'complete',
                        projectView.onCopyComplete
                    )).to.be.eq(true);
                });

            });

        });

        describe('#createZeroClipboard', function() {
            beforeEach(function() {
                projectViewOptions.isFlashEnabled = true;
                projectView = new ProjectView(projectViewOptions);
            });

            it('should create a ZeroClipboard object', function() {
                var zeroClipboard = projectView.createZeroClipboard(
                    document.createElement('div')
                );
                expect(zeroClipboard).to.be.an('object');
                expect(zeroClipboard.options.activeClass).to.be.eq('zeroclipboard-is-active');
            });
        });

    });


});
