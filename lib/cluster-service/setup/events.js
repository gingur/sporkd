'use strict';

var events = require('events'),
  _ = require('lodash');

module.exports = function () {
  if (this.options.events) {
    events.EventEmitter.call(this);
    _.assign(this, events.EventEmitter.prototype);
    process.nextTick(this.trigger.bind(this, 'starting'));
  }
  return this;
};