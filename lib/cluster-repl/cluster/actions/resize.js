'use strict';

module.exports = function (s, callback) {
  var size = parseInt(s, 10);
  if (Number.isFinite(size) && size >= 0) {
    var self = this;
    this.cluster.resize(size, function (err) {
      if (err) {
        self.i18n.writeLn('REPL_RESIZE_FAIL');
      } else {
        self.i18n.writeLn('REPL_RESIZED');
      }
      callback();
    });
  } else {
    this.i18n.writeValue('REPL_RESIZE_INVALID_SIZE', s);
    callback();
  }
};