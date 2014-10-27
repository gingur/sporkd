'use strict';

var cluster = require('cluster');

module.exports = function (callback) {
  this.i18n.writeValue('REPL_RUNNING', Object.keys(cluster.workers).length);
  callback();
};