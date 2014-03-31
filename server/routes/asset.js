'use strict';

var swagger = require('swagger-node-express');

var AssetModel = require('../models/asset-model');

/**
 * Get the list of assets, sorted by name
 */
exports.getAssets = {
    'spec': {
        'description': 'Get assets',
        'path': '/assets',
        'notes': 'Returns an array of assets',
        'summary': 'Get assets library',
        'method': 'GET',
        'params': [],
        'responseClass': 'Asset',
        'errorResponses': [],
        'nickname': 'getAssets'
    },
    'action': function (req, res) {
        console.log('Get assets', req.params);

        AssetModel.find({}).sort({name: 1}).execFind(function (err, assets) {
            if (err) {
                console.log(err);
                return swagger.stopWithError(res);
            }

            return res.json({
                message: 'Success',
                data: assets
            });
        });
    }
};
