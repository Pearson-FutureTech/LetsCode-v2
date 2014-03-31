/* jshint camelcase: false */

'use strict';

// Modules
var Mongoose = require('mongoose');

/**
 * Schema for storing users
 * @type {Mongoose.Schema}
 */
var UserSchema = new Mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    created_at: {
        type: Date,
        required: false
    },

    updated_at: {
        type: Date,
        required: false
    },

    last_login_at: {
        type: Date,
        required: false
    },

    // References from tutorial number (format: "level-number", e.g. "1-2") to Project IDs
    tutorial_project_refs: {
        type: Mongoose.Schema.Types.Mixed,
        required: false
    },

    // NB. Project IDs are given as part of the user but they're added dynamically by the User route

    // Number of the next available tutorial level for the user
    next_tutorial_level: {
        type: Number,
        required: false
    },

    // Number of the next available tutorial inside the tutorial level
    next_tutorial_number: {
        type: Number,
        required: false
    }

});


UserSchema.pre('save', function (next) {
    this.updated_at = new Date();
    if (!this.created_at) {
        this.created_at = new Date();
    }
    next();
});


module.exports = Mongoose.model('User', UserSchema);
