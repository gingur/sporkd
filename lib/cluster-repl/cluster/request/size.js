'use strict';

module.exports = function (callback) {
  this.i18n.writeValue('REPL_SIZE', this.cluster.options.size);
  callback();
};