/* jshint camelcase: false */
/* global describe, it, afterEach */

'use strict';

var expect = require('chai').expect,
    supertest = require('supertest'),
    mongoose = require('mongoose');

var config = require('../config'),
    app = require('../app.js'),
    UserModel = require('../models/user-model');

var request = supertest(app),
    db;

mongoose.connect(config.get('db:mongodbURI'));

db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {});

describe('User Controller', function() {

    describe('POST /api/user/sign_up', function() {

        var username = 'foobar';

        afterEach(function(done) {
            // Remove test user from DB
            UserModel.findOneAndRemove({username: username}).exec(done);
        });

        it('should create a new user', function(done) {
            request
                .post('/api/user/sign_up')
                .end(function(err, res) {

                    if (err) {
                        console.log(err);
                    }

                    username = res.body.username;

                    expect(username).to.be.a('string');

                    UserModel.find({username: username}, function(err, users) {
                        if (err) {
                            console.log(err);
                        }

                        expect(users).to.have.length(1);
                        return done();
                    });
                });
        });

    });




    describe('POST /api/user/sign_in', function() {

        var username = 'foobar';

        afterEach(function(done) {
            // Remove test user from DB
            UserModel.findOneAndRemove({username: username}).exec(done);
        });

        it('should respond with JSON', function(done) {
            request
                .post('/api/user/sign_in')
                .send({ username: username })
                .expect('Content-Type', /json/, done);
        });

        it('should return the right info in the response body', function(done) {
            request
                .post('/api/user/sign_up')
                .end(function(err, res){

                    username = res.body.username;

                    request
                        .post('/api/user/sign_in')
                        .send({
                            username: username,
                            password: 'not-a-password'
                        })
                        .end(function(err, res) {
                            if (err) {
                                console.log(err);
                            }

                            expect(res.body.username).to.be.a('string');
                            return done();
                        });

                });

        });
    });


    describe('GET /api/users/{username}', function() {

        var username;

        afterEach(function(done) {
            // Remove test user from DB
            UserModel.findOneAndRemove({username: username}).exec(done);
        });

        it('should return the right info in the response body', function(done) {
            request
                .post('/api/user/sign_up')
                .end(function(err, res){
                    username = res.body.username;

                    request
                        .get('/api/users/'+username)
                        .end(function(err, res) {
                            if (err) {
                                console.log(err);
                            }

                            expect(res.body.data.username).to.equal(username);
                            return done();
                        });

                });

        });
    });

});
