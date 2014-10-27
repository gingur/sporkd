'use strict';

var _ = require('lodash'),
  async = require('async'),
  cluster = require('cluster');

module.exports = function (callback) {
  if (this.restarting) {
    this.i18n.warn('WARNING_ALREADY_RESTARTING');
    return;
  }
  if (!_.isFunction(callback)) {
    callback = false;
  }
  this.restarting = true;
  var self = this,
    workers = Object.keys(cluster.workers),
    running = workers.length,
    size = this.options.size,
    needed = size - running;
  if (needed !== 0) {
    this.i18n.warn('WARNING_RESIZE_BEFORE_RESTART', needed);
    var done = function (err) {
      self.restarting = false;
      if (err) {
        self.i18n.err('ERROR_RESTARTING', err);
        return void callback && callback(err);
      }
      self.restart(callback);
    };
    return needed > 0
      ? void this.addWorkers(needed, done)
      : void this.removeWorkers(needed * -1, done);
  }
  if (size === 0) {
    this.i18n.warn('WARNING_NOTHING_TO_RESTART');
    this.restarting = false;
    if (callback) {
      callback();
    }
    return;
  }
  this.i18n.debug('DEBUG_RESTARTING', size);
  delete require.cache[require.resolve(this.options.exec)];
  this.addWorkers(1, function (err, created) {
    if (err) {
      self.i18n.err('ERROR_RESTARTING', err);
      if (created.length) {
        self.removeWorkers(created, function (err) {
          self.restarting = false;
          if (callback) {
            callback(err);
          }
        });
      } else {
        self.restarting = false;
        if (callback) {
          callback(err);
        }
      }
      return;
    }
    needed = size - 1;
    self.removeWorkers([workers.shift()], function () {
      async.times(needed, function (ntime, next) {
        async.parallel([
          self.addWorkers.bind(self, 1),
          self.removeWorkers.bind(self, [workers.shift()])
        ], next);
      }, function (err) {
        self.restarting = false;
        if (err) {
          self.i18n.err('ERROR_RESTARTING', err);
        } else {
          self.i18n.debug('DEBUG_RESTARTED');
        }
        if (callback) {
          callback(err);
        }
      });
    });
  });
};