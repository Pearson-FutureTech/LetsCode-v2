/* global describe, it */

'use strict';

var expect = require('chai').expect;

var UserModel = require('../models/user-model');

describe('User Model', function() {

    it('should be a function', function() {
        expect(UserModel).to.be.a('function');
    });

});
