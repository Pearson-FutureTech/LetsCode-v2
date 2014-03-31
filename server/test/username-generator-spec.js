/* global after, describe, it, console */

'use strict';

var expect = require('chai').expect;

var generator = require('../helpers/username-generator'),
    UserModel = require('../models/user-model');

describe('Username Generator', function() {

    var generatedUsers = [];

    after(function(done) {

        // Remove test users
        for( var i=0; i < generatedUsers.length; i++ ) {
            var user = generatedUsers[i];
            user.remove();
        }

        done();

    });

    // 4 possible username combinations: foo-foo-baz, foo-bar-baz, bar-foo-baz, bar-bar-baz
    var words = {
        adjectives: ['foo', 'bar'],
        nouns: ['baz']
    };

    function isUsernameUnique(newUsername) {

        var i = 0,
            length = generatedUsers.length;

        for (; i < length; i++) {
            if (newUsername === generatedUsers[i].username) {
                return false;
            }
        }

        return true;
    }

    it('should generate usernames in the right format', function(done) {

        generator(words, function(err, username) {
            expect(username).to.be.a('string');
            done();
        });
    });

    it('should generate unique usernames', function(done) {

        var maxPossibleUniqueNames = words.adjectives.length * words.adjectives.length * words.nouns.length;

        function createUser(username, callback) {

            var user = new UserModel({ username: username });

            user.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    generatedUsers.push(user);
                    callback();
                }
            });
        }

        function getUsername() {

            generator(words, function(err, username) {

                if (err) {
                    if (err.error === 'Exceeded attempts to find unique name') {
                        expect(generatedUsers.length).to.equal(maxPossibleUniqueNames);
                        done();
                    } else {
                        console.log(err);
                    }
                } else {

                    expect(isUsernameUnique(username)).to.equal(true);

                    createUser(username, function() {
                        getUsername();
                    });
                }
            });
        }

        getUsername();

    });
});
