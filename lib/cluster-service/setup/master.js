'use strict';

var cluster = require('cluster');

module.exports = function () {
  var config = {
    exec: this.options.exec
  };
  if (this.options.silent) {
    config.silent = this.options.silent;
  }
  if (this.options.env) {
    config.env = this.options.env;
  }
  if (this.options.args) {
    config.args = this.options.args;
  }
  cluster.setupMaster(config);
  return this.i18n.debug('DEBUG_SETUP_MASTER');
};