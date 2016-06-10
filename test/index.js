var test = require('tape')
var tryConnect = require('../')
var http = require('http')
var port = 9999

const Server => http.createServer((req, res) => res.end())

test('emits "connected" when connected', t => {
  t.plan(1)
  var server = Server()
  server.listen(port, () => {
    tryConnect({
      port,
      retry: 1000
    }).on('connected', () => {
      server.close(() => {
        t.pass()
      })
    })
  })
})

test('emits "timeout" when time is out', t => {
  t.plan(1)
  tryConnect({
    port,
    retry: 40,
    retries: 2
  }).on('timeout', mainError => t.pass())
})

test('emits "retry" with connection error message', t => {
  t.plan(3)
  tryConnect({
    port,
    retry: 10,
    retries: 3
  })
  .on('retry', reason => t.true(reason))
})
