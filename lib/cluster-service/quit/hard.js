'use strict';

module.exports = function () {
  if (!this.quitting) {
    this.quitting = true;
    this.quit();
  }
};