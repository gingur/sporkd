'use strict';
var http = require('http'),
  port = process.env.PORT || 3000;

process.send('loading');

http.createServer(function (req, res) {
  res.write('Hello World!');
  res.end();
}).listen(port, function (err) {
  if (err) {
    console.error('Unable to listen on port', port, err);
    process.exit();
    return;
  }
  console.log('Listening on port', port);
  setTimeout(function () {
    process.send('listening');
  }, 2000);
});