'use strict';

var _ = require('lodash');

module.exports = function (worker, callback) {
  if (!_.isFunction(callback)) {
    callback = false;
  }
  var maxClose = this.options.maxClosingMs || 0;
  this.i18n.debug('DEBUG_REMOVE');
  var timeout;
  if (maxClose > 0) {
    var self = this;
    timeout = setTimeout(function () {
      self.i18n.err('ERROR_MAX_SHUTDOWN', maxClose);
      worker.removeAllListeners('exit');
      worker.kill();
      process.nextTick(function () {
        _.remove(self.removing, {id: worker.id});
      });
      if (callback) {
        callback();
      }
    }, maxClose);
  }
  worker.once('exit', function () {
    if (timeout) {
      clearTimeout(timeout);
    }
    process.nextTick(function () {
      _.remove(self.removing, {id: worker.id});
    });
    if (callback) {
      callback();
    }
  });
  this.removing.push(worker);
  worker.send('shutdown');
  worker.disconnect();
};