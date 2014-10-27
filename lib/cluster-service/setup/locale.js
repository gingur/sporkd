'use strict';

var i18n = require('i18n');

module.exports = function () {
  i18n.configure({
    defaultLocale: this.options.locale,
    directory: this.options.localePath
  });
  this.i18n = {
    debug: require('../logger/i18n/debug').bind(this),
    warn: require('../logger/i18n/warn').bind(this),
    err: require('../logger/i18n/err').bind(this)
  };
  return this.i18n.debug('DEBUG_SETUP_I18N', this.options.locale);
};