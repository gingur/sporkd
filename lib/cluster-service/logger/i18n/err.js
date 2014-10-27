'use strict';

var i18n = require('i18n');

module.exports = function () {
  arguments[0] = i18n.__(arguments[0]);
  return this.err.apply(this, arguments);
};