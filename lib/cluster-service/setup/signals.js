'use strict';

var _ = require('lodash'),
  cluster = require('cluster');

module.exports = function () {
  if (this.options.signals !== false) {
    try {
      process.on('SIGHUP', this.restart.bind(this));
      process.on('SIGINT', this.quit.bind(this));
    } catch (e) {
      // Not available on Windows
    }
    process.on('exit', this.quitHard.bind(this));

    var self = this;
    cluster.on('exit', function (worker) {
      if (!_.some(self.removing, {id: worker.id})) {
        self.i18n.err('ERROR_WORKER_DIED', worker.id);
        self.addWorkers(1);
      }
    });
    this.i18n.debug('DEBUG_SETUP_SIGNALS');
  }
  return this;
};