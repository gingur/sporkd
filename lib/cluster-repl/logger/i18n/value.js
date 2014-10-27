'use strict';

var i18n = require('i18n');

module.exports = function (key, value) {
  return this.writeValue(i18n.__(key), value);
};