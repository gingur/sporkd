'use strict';

var _ = require('lodash');

module.exports = function () {
  if (this.options.debug !== false) {
    console.info.apply(console, arguments);
  }
  var flattened = _.map(arguments);
  this.trigger.apply(this, ['debug'].concat(flattened));
  this.trigger.apply(this, flattened);
  return this;
};