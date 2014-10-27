'use strict';

var cluster = require('cluster');

module.exports = function () {
  if (this.quitting) {
    // Force shutdown
    Object.keys(cluster.workers).forEach(function (id) {
      var worker = cluster.workers[id];
      worker.kill();
    });
    process.exit(1);
    return;
  }
  this.quitting = true;
  this.resize(0, function () {
    process.exit(0);
  });
};