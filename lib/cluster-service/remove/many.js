'use strict';

var _ = require('lodash'),
  async = require('async'),
  cluster = require('cluster');

module.exports = function (count, callback) {
  var self = this,
    workers = Object.keys(cluster.workers);
  if (!_.isFunction(callback)) {
    callback = false;
  }
  if (_.isArray(count)) {
    workers = count;
    count = workers.length;
  } else if (count <= 0) {
    count = 1;
  }
  async.times(count, function (ntime, next) {
    var worker = cluster.workers[workers.shift()];
    if (!worker) {
      return void next();
    }
    self.removeWorker(worker, next);
  }, callback);
};