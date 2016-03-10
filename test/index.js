var test = require('tape')
var whenCnctReady = require('../')
var http = require('http')
var testPort = 9999
var Promise = require('bluebird')

function Server() {
  return http.createServer(function(req, res) { res.end() })
}

test('emits "connected" when connected', function(t) {
  t.plan(1)
  var server = Server()
  server.listen(testPort, function() {
    whenCnctReady({port: testPort, timeout: 1000}).on('connected', function() {
      server.close(function() {
        t.pass()
      })
    })
  })
})

test('emits "timeout" when timed out', function(t) {
  t.plan(1)
  whenCnctReady({port: testPort, retry: 40, timeout: 100}).on('timeout', t.pass)
})

test('emits "retry" with connection error message', function(t) {
  t.plan(3)
  whenCnctReady({port: testPort, retry: 10, timeout: 30})
  .on('retry', function(reason) {
    t.true(reason)
  })
})
