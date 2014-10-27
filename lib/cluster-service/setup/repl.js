'use strict';

var _ = require('lodash'),
  repl = require('../../cluster-repl');

module.exports = function (callback) {
  if (!_.isFunction(callback)) {
    callback = false;
  }
  var replPort = this.options.repl;
  if (replPort) {
    var self = this;
    this.repl = repl(this, replPort, function () {
      self.i18n.debug('DEBUG_SETUP_REPL', replPort);
      if (callback) {
        callback();
      }
      self.trigger('started');
    });
  } else if (callback) {
    callback();
    this.trigger('started');
  }
  return this;
};