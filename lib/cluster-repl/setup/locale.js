'use strict';

module.exports = function () {
  this.i18n = {
    writeLn: require('../logger/i18n/line').bind(this),
    writeValue: require('../logger/i18n/value').bind(this)
  };
  return this;
};