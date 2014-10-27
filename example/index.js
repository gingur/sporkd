'use strict';

var path = require('path'),
  cluster = require('../lib/cluster-service')({
    exec: path.resolve(__dirname, 'test.js')
  });
// Events
cluster.on('starting', function () {
  console.log('Starting');
}).on('started', function () {
  console.log('Started');
}).on('error', function () {
  console.error.apply(console, arguments);
});