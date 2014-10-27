'use strict';

var async = require('async'),
  cluster = require('cluster');

module.exports = function () {
  var args = Array.prototype.slice.call(arguments, 0),
    callback = args.pop();
  if (!args.length) {
    return void callback('REPL_REMOVE_NO_IDS');
  }
  var self = this;
  async.times(args.length, function (ntime, next) {
    var wid = args.shift(),
      worker = cluster.workers[wid];
    if (!worker) {
      self.i18n.writeValue('REPL_REMOVE_404', wid);
      return void next();
    }
    self.cluster.removeWorker(worker, function (err) {
      if (err) {
        self.i18n.writeValue('REPL_REMOVE_FAIL', wid);
      } else {
        self.i18n.writeValue('REPL_REMOVED', wid);
      }
      next();
    });
  }, function () {
    callback();
  });
};