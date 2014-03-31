/*global casper*/

'use strict';

casper.test.begin('CSS loads', 1, function suite(test) {

    casper.start('http://localhost:9000/');

    casper.on('load.finished', function() {
        test.assertResourceExists('main.css');
    });

    casper.run(function() {
        test.done();
    });
});
