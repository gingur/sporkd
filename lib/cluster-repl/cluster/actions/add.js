'use strict';

module.exports = function (s, callback) {
  var self = this,
    size = parseInt(s, 10);
  if (Number.isFinite(size) && size >= 0) {
    this.cluster.addWorkers(size, function (err) {
      if (err) {
        self.i18n.writeLn('REPL_ADD_FAILED');
      } else {
        self.i18n.writeLn('REPL_ADDED');
      }
      callback();
    });
  } else {
    self.i18n.writeValue('REPL_ADD_INVALID_COUNT', s);
    callback();
  }
};