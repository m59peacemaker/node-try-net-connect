var net = require('net');

var defaults = {
  service: 'service',
  retry: 1000
};

module.exports = function(opts, cb) {
  var service = opts.service || defaults.service;
  var shouldTimeout = false;
  if (opts.timeout !== undefined) {
    setTimeout(function() {
      shouldTimeout = true;
    }, opts.timeout);
  }
  attemptConnection();

  function attemptConnection() {
    console.log(new Date().toISOString()+' Waiting to connect to '+service+'...');
    var client = net.connect(opts, function() {
      client.destroy();
      console.log(service+' is available.');
      cb();
    }).on('error', function(err) {
      if (shouldTimeout) {
        cb(service+' could not be reached in '+opts.timeout+'ms. '+err.toString());
      } else {
        setTimeout(attemptConnection, opts.retry || defaults.retry);
      }
    });
  }
};
