'use strict';

module.exports = function (data) {
  this.socket.write(data + '\r\n');
  return this;
};