'use strict';

module.exports = function () {
  if (this.options.errors !== false) {
    console.error.apply(console, arguments);
  }
  this.trigger.apply(this, ['error'].concat(arguments));
  this.trigger.apply(this, arguments);
  return this;
};