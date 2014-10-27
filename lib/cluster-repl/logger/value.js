'use strict';

var util = require('util');

module.exports = function (key, value) {
  return this.writeLn(util.format('%s\t-\t%s', key, value));
};