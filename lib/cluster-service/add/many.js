'use strict';

var _ = require('lodash'),
  async = require('async');

module.exports = function (count, callback) {
  if (!_.isFunction(callback)) {
    callback = false;
  }
  if (count <= 0) {
    count = 1;
  }
  var maxTries = this.options.maxStartAttempts || 1;
  if (maxTries <= 0) {
    maxTries = 1;
  }
  var self = this,
    workers = [];
  async.times(count, function (ntime, next) {
    async.retry(maxTries, function (done, attempt) {
      attempt = attempt || 0;
      if (++attempt > 1) {
        self.i18n.debug('DEBUG_ADD_RETRY, attempt');
      }
      var worker = self.addWorker(function (err) {
        if (!err) {
          workers.push(worker);
        }
        next(err, attempt);
      });
    }, next);
  }, function (err) {
    if (callback) {
      callback(err, workers);
    }
  });
};