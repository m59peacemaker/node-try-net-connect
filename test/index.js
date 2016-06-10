var test = require('tape')
var tryConnect = require('../')
var http = require('http')
var testPort = 9999

function Server() {
  return http.createServer(function(req, res) { res.end() })
}

test('emits "connected" when connected', function(t) {
  t.plan(1)
  var server = Server()
  server.listen(testPort, function() {
    tryConnect({port: testPort, timeout: 1000}).on('connected', function() {
      server.close(function() {
        t.pass()
      })
    })
  })
})

test('emits "timeout" when timed out', function(t) {
  t.plan(1)
  tryConnect({port: testPort, retry: 40, timeout: 100}).on('timeout', t.pass)
})

test('emits "retry" with connection error message', function(t) {
  t.plan(3)
  tryConnect({port: testPort, retry: 10, timeout: 30})
  .on('retry', function(reason) {
    t.true(reason)
  })
})
