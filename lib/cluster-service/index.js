'use strict';

var os = require('os'),
  fs = require('fs'),
  path = require('path'),
  i18n = require('i18n'),
  _ = require('lodash');

function ClusterService(opts, callback) {
  if (!(this instanceof ClusterService)) {
    return new ClusterService(opts, callback);
  }
  var self = this;
  this.removing = [];
  this.options = _.defaults(opts || {}, {
    locale: 'en',
    localePath: path.resolve(__dirname, '../locales'),
    size: os.cpus().length,
    silent: true,
    maxStartAttempts: 3,
    maxListeningMs: 2000, // 2sec
    maxLoadingMs: 600000, // 1min
    maxClosingMs: 2000, // 2sec
    minRunningMs: 2000, // 2sec
    debug: true,
    warnings: true,
    errors: true,
    events: true,
    repl: 5000
  });
  if (!_.isFunction(callback)) {
    callback = false;
  }
  // Events
  this.setupEvents();
  setImmediate(function () {
    // Locale
    self.setupLocale();
    if (!fs.existsSync(self.options.exec) || !require.resolve(self.options.exec)) {
      var err = i18n.__('ERROR_INVALID_WORKER_PATH');
      self.err(err, self.options.exec);
      if (callback) {
        callback(err);
      }
      return;
    }
    self
      // Cluster
      .setupMaster()
      // REPL
      .setupSignals()
      // Start
      .resize(function (err) {
        if (err) {
          if (!_.isFunction(callback)) {
            callback(err);
          }
          return;
        }
        self.setupRepl(callback);
      });
  });
  return this;
}

ClusterService.prototype = {
  debug: require('./logger/debug'),
  warn: require('./logger/warn'),
  err: require('./logger/err'),
  trigger: require('./logger/trigger'),
  setupEvents: require('./setup/events'),
  setupLocale: require('./setup/locale'),
  setupMaster: require('./setup/master'),
  setupSignals: require('./setup/signals'),
  setupRepl: require('./setup/repl'),
  restart: require('./actions/restart'),
  resize: require('./actions/resize'),
  quit: require('./quit'),
  quitHard: require('./quit/hard'),
  addWorker: require('./add/one'),
  addWorkers: require('./add/many'),
  removeWorker: require('./remove/one'),
  removeWorkers: require('./remove/many')
};

module.exports = ClusterService;