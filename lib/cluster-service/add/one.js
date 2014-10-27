'use strict';

var _ = require('lodash'),
  cluster = require('cluster'),
  i18n = require('i18n');

module.exports = function (callback) {
  if (!_.isFunction(callback)) {
    callback = false;
  }
  this.i18n.debug('DEBUG_ADD');
  var self = this,
    worker = cluster.fork(this.options.env),
    maxListen = this.options.maxListeningMs || 0,
    maxWarmup = this.options.maxLoadingMs || 0,
    minRunning = this.options.minRunningMs || 0,
    finished = false,
    timeout;
  if (maxListen > 0) {
    timeout = setTimeout(function () {
      worker.kill();
      self.i18n.err('ERROR_MAX_LISTENING', maxListen);
      if (callback) {
        callback(i18n.__('ERROR_MAX_LISTENING'));
      }
    }, maxListen);
  }
  worker.on('message', function (msg) {
    if (msg === 'loading') {
      if (timeout) {
        clearTimeout(timeout);
      }
      worker.removeAllListeners('listening');
      self.i18n.debug('DEBUG_ADD_LOADING');
      worker.once('listening', function (address) {
        worker.address = address;
      });
      if (maxWarmup > 0) {
        timeout = setTimeout(function () {
          // Took to long to warm-up
          worker.removeAllListeners('message');
          worker.removeAllListeners('exit');
          worker.kill();
          finished = true;
          self.i18n.err('ERROR_MAX_LOADING', maxWarmup);
          if (callback) {
            callback(i18n.__('ERROR_MAX_LOADING'));
          }
        }, maxWarmup);
      }
    } else if (msg === 'listening') {
      if (timeout) {
        clearTimeout(timeout);
      }
      worker.removeAllListeners('exit');
      worker.removeAllListeners('message');
      if (finished) {
        return;
      }
      finished = true;
      self.i18n.debug('DEBUG_ADDED', worker.address);
      if (callback) {
        callback();
      }
    }
  });
  worker.once('listening', function (address) {
    if (timeout) {
      clearTimeout(timeout);
    }
    worker.address = address;
    var done = function () {
      worker.removeAllListeners('exit');
      worker.removeAllListeners('message');
      if (finished) {
        return;
      }
      finished = true;
      var onexit = function () {
        self.warn('WARN_WORKER_DIED', worker.id);
        self.addWorkers(1);
      };
      try {
        worker.on('SIGHUP', onexit);
        worker.on('SIGINT', onexit);
      } catch (e) {
        self.err(e);
        // Not available on Windows
      }
      worker.on('exit', onexit);
      worker.on('disconnect', onexit);
      self.i18n.debug('DEBUG_ADDED', worker.address);
      if (callback) {
        callback();
      }
    };
    if (minRunning > 0) {
      if (finished) {
        return;
      }
      self.i18n.debug('DEBUG_ADD_WAITING', minRunning);
      timeout = setTimeout(function () {
        done();
      }, minRunning);
    } else {
      done();
    }
  });
  worker.once('exit', function () {
    if (timeout) {
      clearTimeout(timeout);
    }
    worker.removeAllListeners('listening');
    worker.removeAllListeners('message');
    worker.kill();
    if (finished) {
      return;
    }
    finished = true;
    self.i18n.err('ERROR_ADDING');
    if (callback) {
      callback(i18n.__('ERROR_ADDING'));
    }
  });
  return worker;
};