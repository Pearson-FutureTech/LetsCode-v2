'use strict';

var UserModel = require('../models/user-model');

/**
 * Returns a random integer between 0 and max
 */
function getRandomInt(max) {

    return Math.floor(Math.random() * max);

}

/**
 * Returns a random word from the word list
 */
function getRandomWord(list) {

    return list[getRandomInt(list.length)];

}

/**
 * Returns a unique username
 * FIXME this is very inefficient - it keeps checking each generated word to see if it has already been taken.
 * At the least, we should do one DB call to get the list of all usernames, and just check against that.
 */
function createUserName(words, attemptsLeft, callback) {

    var username = getRandomWord(words.adjectives) +
            '-' + getRandomWord(words.adjectives) +
            '-' + getRandomWord(words.nouns);

    attemptsLeft--;

    UserModel.findOne({ username: username }, function (err, user) {

        if (err) {

            console.log(err);
            callback(err, null);

        } else {

            if (user === null) {

                callback(null, username);

            } else {

                if (attemptsLeft !== 0) {

                    createUserName(words, attemptsLeft, callback);

                } else {

                    callback({
                        error: 'Exceeded attempts to find unique name'
                    }, null);
                }
            }
        }
    });
}

function getUniqueUsername(words, callback) {

    var attempts = 15;

    createUserName(words, attempts, callback);
}

module.exports = getUniqueUsername;
