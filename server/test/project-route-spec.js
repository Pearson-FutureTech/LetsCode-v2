/* jshint camelcase: false */
/* jshint unused:false */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var expect = require('chai').expect,
    supertest = require('supertest');

var ProjectModel = require('../models/project-model'),
    UserModel = require('../models/user-model'),
    app = require('../app.js');

var request = supertest(app);


describe('Projects Controller', function() {

    describe('GET /api/projects/:id', function() {

        it('should respond with JSON', function(done) {
            request
                .get('/api/projects/012345678901234567890123')
                .expect('Content-Type', /json/, done);
        });

    });

    describe('PATCH /api/projects/:id', function() {

        describe('When the user is logged in', function() {

            var updateProperties = {
                    name: 'foo-bar-baz-project',
                    description: 'test project',
                    stage: '{}',
                    is_featured: false
                },
                testProject,
                user,
                cookie;

            before(function(done) {

                user = new UserModel({ username: 'foo-bar-baz' });

                user.save(function() {

                    testProject = new ProjectModel();
                    testProject.author_id = user._id;

                    testProject.save(function() {

                        // Authenticate user
                        request
                            .post('/api/user/sign_in')
                            .send({username: 'foo-bar-baz', password: 'not-really-a-password'})
                            .end(function(err, res) {

                                expect(res.status).to.eq(200);

                                cookie = res.headers['set-cookie'];

                                done();

                            });

                    });

                });

            });

            after(function(done) {
                // Remove test user and test project
                testProject.remove(function() {
                    user.remove(done);
                });
            });

            describe('When the project exists', function() {

                it('should respond with JSON', function(done) {
                    request
                        .patch('/api/projects/' + testProject._id)
                        .set('cookie', cookie)
                        .send(updateProperties)
                        .expect('Content-Type', /json/, done);
                });

                it('should return a success message and update the project', function(done) {

                    request
                        .patch('/api/projects/' + testProject._id)
                        .set('cookie', cookie)
                        .send(updateProperties)
                        .end(function(err, res) {

                            expect(res.body.message).to.eq('Project updated successfully');

                            ProjectModel.findById(testProject._id, function(err, updated) {

                                expect(updated.name).to.eq(updateProperties.name);
                                expect(updated.description).to.eq(updateProperties.description);
                                expect(updated.stage).to.eq(updateProperties.stage);
                                expect(updated.is_featured).to.eq(updateProperties.is_featured);

                                return done();
                            });
                        });

                });

            });
        });
    });


});
