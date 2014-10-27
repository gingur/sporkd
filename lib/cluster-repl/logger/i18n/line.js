'use strict';

var i18n = require('i18n');

module.exports = function (data) {
  return this.writeLn(i18n.__(data));
};