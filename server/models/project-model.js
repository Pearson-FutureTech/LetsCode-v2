/* jshint camelcase: false */

'use strict';

// Modules
var Mongoose = require('mongoose');

// Schema for storing projects
var ProjectSchema = new Mongoose.Schema({

    // Reference user
    author_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Tutorial ID if project was created from a tutorial
    tutorial_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Tutorial',
        required: false
    },

    // Unique project name
    name: {
        type: String
    },

    // Optional description
    description: {
        type: String
    },

    // Project game stage
    stage: {
        type: Mongoose.Schema.Types.Mixed
    },

    created_at: {
        type: Date,
        required: false
    },

    updated_at: {
        type: Date,
        required: false
    },

    // Will it be featured? (Not used yet).
    is_featured: {
        type: Boolean,
        'default': false
    }

});

ProjectSchema.pre('save', function (next) {
    this.updated_at = new Date();
    if (!this.created_at) {
        this.created_at = new Date();
    }
    next();
});

module.exports = Mongoose.model('Project', ProjectSchema);
