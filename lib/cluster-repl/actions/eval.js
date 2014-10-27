'use strict';

module.exports = function (input, context, filename, callback) {
  var cmd = input
    .replace(/(\r\n|\n|\r)/g, '')
    .replace(/^\(/, '')
    .replace(/\)$/, '');
  switch (cmd) {
    case 'size':
      this.size(callback);
      break;
    case 'running':
      this.running(callback);
      break;
    case 'pids':
      this.pids(callback);
      break;
    case 'help':
      this.help(callback);
      break;
    case 'restart':
      this.restart(callback);
      break;
    default:
      var parsed = /([^\( ]+)\s*\((.*)\)$/.exec(cmd) || [];
      if (parsed.length >= 3) {
        var method = parsed[1];
        if (this[method]) {
          var args = parsed[2].split(',').map(function (arg) {
            arg = arg.trim();
            return context.hasOwnProperty(arg)
              ? context[arg]
              : arg;
          });
          this[method].apply(this, args.concat(callback));
          break;
        }
      }
      this.help(callback);
      break;
  }
};