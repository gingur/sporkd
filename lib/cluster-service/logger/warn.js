'use strict';

module.exports = function () {
  if (this.options.warnings !== false) {
    console.warn.apply(console, arguments);
  }
  this.trigger.apply(this, ['warning'].concat(arguments));
  this.trigger.apply(this, arguments);
  return this;
};