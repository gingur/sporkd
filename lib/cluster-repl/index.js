'use strict';

var _ = require('lodash'),
  i18n = require('i18n'),
  repl = require('repl'),
  net = require('net');

function ClusterRepl(cluster, port, callback) {
  if (!(this instanceof ClusterRepl)) {
    return new ClusterRepl(cluster, port, callback);
  }
  this.cluster = cluster;
  if (!_.isFunction(callback)) {
    callback = false;
  }
  this
    .setupLocale()
    .setupServer(port, callback);
}

ClusterRepl.prototype = {
  writeLn: require('./logger/line'),
  writeValue: require('./logger/value'),
  setupLocale: require('./setup/locale'),
  setupServer: require('./setup/server'),
  evalFn: require('./actions/eval'),
  help: require('./actions/help'),
  add: require('./cluster/actions/add'),
  kill: require('./cluster/actions/kill'),
  pids: require('./cluster/request/pids'),
  size: require('./cluster/request/size'),
  resize: require('./cluster/actions/resize'),
  running: require('./cluster/request/running'),
  remove: require('./cluster/actions/remove'),
  restart: require('./cluster/request/restart')
};

module.exports = ClusterRepl;