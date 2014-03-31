/* jshint camelcase: false */

'use strict';

// Modules
var Mongoose = require('mongoose');

// Schema for storing projects
var TutorialSchema = new Mongoose.Schema({

    // Tutorial level number
    level: {
        type: Number,
        required: true
    },

    // Number of the tutorial within the lesson
    number: {
        type: Number,
        required: true
    },

    // Tutorial title
    name: {
        type: String,
        required: true
    },

    // Description
    description: {
        type: String,
        required: true
    },

    // The entities that should appear on stage for the tutorial
    // TODO We should actually point to a project, which should define assets plus project-specific properties
    entities: {
        type: Array,
        required: true
    },

    // Tutorial steps
    steps: {
        type: Mongoose.Schema.Types.Mixed,
        required: false
    },

    created_at: {
        type: Date,
        required: false
    },

    updated_at: {
        type: Date,
        required: false
    }

});

TutorialSchema.pre('save', function (next) {
    this.updated_at = new Date();
    if (!this.created_at) {
        this.created_at = new Date();
    }
    next();
});

module.exports = Mongoose.model('Tutorial', TutorialSchema);
