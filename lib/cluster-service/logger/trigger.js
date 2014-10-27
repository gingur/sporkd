'use strict';

module.exports = function () {
  if (this.emit && this.options.events) {
    this.emit.apply(this, arguments);
  }
  return this;
};