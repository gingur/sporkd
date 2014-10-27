'use strict';

var async = require('async'),
  cluster = require('cluster');

module.exports = function () {
  var args = Array.prototype.slice.call(arguments, 0),
    callback = args.pop();
  if (!args.length) {
    return void callback('REPL_KILL_NO_IDS');
  }
  var self = this;
  async.times(args.length, function (ntime, next) {
    var wid = args.shift(),
      worker = cluster.workers[wid];
    if (!worker) {
      self.i18n.writeValue('REPL_KILL_404', wid);
      return void next();
    }
    worker.kill();
    self.i18n.writeValue('REPL_KILLED', wid);
    next();
  }, function () {
    callback();
  });
};