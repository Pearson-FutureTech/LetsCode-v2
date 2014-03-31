/*
 * Configuration module - simple wrapper around initialised nconf instance
 */

'use strict';

var nconf = require('nconf'),
    fs = require('fs');


function Config() {

    var paths = {
        local: __dirname + '/config/'
    },
    pathToLocalConfig;

    nconf.use('memory');

    nconf.argv();
    nconf.env();

    if (nconf.get('NODE:ENV')) {
        nconf.set('environment', nconf.get('NODE:ENV'));
    } else {
        nconf.set('environment', 'development');
    }

    if (nconf.get('environment') === 'development') {

        pathToLocalConfig = paths.local + 'local.json';

        if (fs.existsSync(pathToLocalConfig)) {

            // Allow local overrides to the default development settings
            nconf.file('local', pathToLocalConfig);
        }

        // Default development settings
        nconf.file('development', paths.local + 'development.json');
    }

    // Configuration common to development and production
    nconf.file('default', paths.local + 'default.json');
    
}

Config.prototype.get = function (key) {
    return nconf.get(key);
};

module.exports = new Config();
