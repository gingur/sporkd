'use strict';

module.exports = function (callback) {
  var self = this;
  this.cluster.restart(function (err) {
    if (err) {
      self.i18n.writeLn('REPL_RESTART_FAIL');
    } else {
      self.i18n.writeLn('REPL_RESTARTED');
    }
    callback();
  });
};