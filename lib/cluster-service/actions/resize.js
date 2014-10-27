'use strict';

var _ = require('lodash'),
  cluster = require('cluster');

module.exports = function (size, callback) {
  if (this.resizing) {
    this.i18n.warn('WARNING_ALREADY_RESIZING');
    return;
  }
  this.resizing = true;
  if (_.isFunction(size)) {
    callback = size;
    size = this.options.size;
  } else if (!_.isFunction(callback)) {
    callback = false;
  }
  this.options.size = size;
  var workers = Object.keys(cluster.workers),
    running = workers.length,
    needed = this.options.size - running;
  if (needed === 0) {
    this.resizing = false;
    this.i18n.warn('WARNING_ALREADY_RESIZED');
    if (callback) {
      callback();
    }
    return;
  }
  this.i18n.debug('DEBUG_RESIZING', size);
  var self = this;
  var done = function (err) {
    self.resizing = false;
    if (err) {
      self.i18n.err('ERROR_RESIZING', err);
    } else {
      self.i18n.debug('DEBUG_RESIZED');
    }
    if (callback) {
      callback(err);
    }
  };
  if (needed > 0) {
    // Add workers
    self.addWorkers(needed, done);
  } else {
    // Remove workers
    self.removeWorkers(needed * -1, done);
  }
};