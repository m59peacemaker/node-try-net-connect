var test = require('tape');
var whenCnctReady = require('../');
var http = require('http');
var testPort = 9999;

var server = http.createServer(function(req, res) { res.end(); });

test('fires cb when connected', function(t) {
  t.plan(1);
  server.listen(testPort, function() {
    whenCnctReady({port: testPort, timeout: 1000}, function(err) {
      server.close();
      t.false(err);
    });
  });
});

test('fires cb with err when timed out', function(t) {
  t.plan(1);
  whenCnctReady({port: testPort, retry: 40, timeout: 100}, function(err) {
    t.true(err);
  });
});

test('attempts connection at set interval', function(t) {
  t.plan(1);
  var tries = 0;
  oldLog = console.log;
  console.log = function() { ++tries; };
  whenCnctReady({port: testPort, retry: 10, timeout: 100}, function() {
    console.log = oldLog;
    t.equal(tries, 10);
  });
});

test('uses service name in logs', function(t) {
  t.plan(1);
  var service = 'MyService';
  var oldLog = console.log;
  console.log = function(msg) {
    console.log = oldLog;
    t.true(~msg.indexOf(service));
  };
  whenCnctReady({port: testPort, retry: 10000, timeout: 0, service: service}, function() {});
});
