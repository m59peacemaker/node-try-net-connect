var test = require('tape')
var tryConnect = require('../')
var http = require('http')
var port = 9999

const Server = () => http.createServer((req, res) => res.end())

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

test('can be stopped', t => {
  t.plan(1)
  let tries = 0
  const struggles = tryConnect({
    port,
    retry: 10,
    retries: 10
  })
  .on('retry', reason => {
    struggles.stop()
    ++tries
    t.equal(tries, 1)
  })
})

test('delays retries according to `retry` option when limited retries', t => {
  t.plan(1)
  const startTime = new Date().getTime()
  const retryTime = 1000
  const retries = 1
  tryConnect({
    port,
    retry: retryTime,
    retries
  })
  .on('timeout', () => {
    const currentTime = new Date().getTime()
    const minTime = startTime + retryTime
    const maxTime = minTime + 100
    t.true(currentTime > minTime && currentTime < maxTime)
  })
})

test('delays retries according to `retry` option when infinite retries', t => {
  t.plan(1)
  const startTime = new Date().getTime()
  const retryTime = 1000
  let ready = false
  const emitter = tryConnect({
    port,
    retry: retryTime
  })
  .on('retry', () => {
    if (ready) {
      const currentTime = new Date().getTime()
      const minTime = startTime + retryTime
      const maxTime = minTime + 100
      t.true(currentTime > minTime && currentTime < maxTime)
      emitter.stop()
    } else {
      ready = true
    }
  })
})
