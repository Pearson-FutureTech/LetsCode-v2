/* global describe, it */

'use strict';

var expect = require('chai').expect;

var ProjectModel = require('../models/project-model');

describe('Project Model', function() {

    it('should be a function', function() {
        expect(ProjectModel).to.be.a('function');
    });
});
