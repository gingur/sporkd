'use strict';

var net = require('net'),
  repl = require('repl'),
  i18n = require('i18n');

module.exports = function (port, callback) {
  var self = this;
  net.createServer(function (socket) {
    socket.setEncoding('utf8');
    self.socket = socket;
    self.repl = repl.start({
      prompt: i18n.__('REPL_PROMPT'),
      input: socket,
      output: socket,
      terminal: true,
      useGlobal: false,
      useColors: true,
      ignoreUndefined: true,
      eval: self.evalFn.bind(self)
    });
    self.repl.on('exit', function () {
      socket.end();
    });
  }).listen(port, callback || undefined);
};