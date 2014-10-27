'use strict';

var cluster = require('cluster'),
  i18n = require('i18n');

module.exports = function (callback) {
  for (var w in cluster.workers) {
    if (cluster.workers.hasOwnProperty(w)) {
      var worker = cluster.workers[w];
      this.writeValue(i18n.__('REPL_PID', worker.id), worker.process.pid);
    }
  }
  callback();
};