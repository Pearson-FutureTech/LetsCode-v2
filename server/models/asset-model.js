/* jshint camelcase: false */

'use strict';

// Modules
var Mongoose = require('mongoose');

// Schema for storing projects
var AssetSchema = new Mongoose.Schema({

    // Asset name
    name: {
        type: String,
        required: true
    },

    // Default ID to use for instances
    default_instance_id: {
        type: String,
        required: true
    },

    // Optional description
    description: {
        type: String,
        required: false
    },

    // Asset properties
    properties: {
        type: Mongoose.Schema.Types.Mixed,
        required: false
    },

    // Asset Methods
    methods: {
        type: Mongoose.Schema.Types.Mixed,
        required: false
    },

    // Asset Events
    events: {
        type: [],
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

AssetSchema.pre('save', function (next) {
    this.updated_at = new Date();
    if (!this.created_at) {
        this.created_at = new Date();
    }
    next();
});

module.exports = Mongoose.model('Asset', AssetSchema);
