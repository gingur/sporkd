'use strict';

var i18n = require('i18n');

module.exports = function (callback) {
  this
    .writeValue('help', i18n.__('REPL_HELP'))
    .writeValue('add', i18n.__('REPL_HELP_ADD'))
    .writeValue('kill', i18n.__('REPL_HELP_KILL'))
    .writeValue('pids', i18n.__('REPL_HELP_PIDS'))
    .writeValue('size', i18n.__('REPL_HELP_SIZE'))
    .writeValue('resize', i18n.__('REPL_HELP_RESIZE'))
    .writeValue('running', i18n.__('REPL_HELP_RUNNING'))
    .writeValue('remove', i18n.__('REPL_HELP_REMOVE'))
    .writeValue('restart', i18n.__('REPL_HELP_RESTART'));
  callback(null);
};