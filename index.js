var net = require('net')
var EventEmitter = require('events').EventEmitter
var retry = require('retry')

var defaults = {
  retry: 1000,
  retries: null
}

module.exports = options => {
  options = Object.assign({}, defaults, options)
  const retryOptions = {
    forever: true,
    factor: 0,
    retries: options.retries
  }
  if (Boolean(options.retries)) {
    retryOptions.forever = false
    retryOptions.minTimeout = options.retry
    retryOptions.maxTimeout = options.retry
  }

  var emitter = new EventEmitter()

  var operation = retry.operation(retryOptions)

  operation.attempt(currentAttempt => {
    var client = net.connect(options, () => {
      client.destroy()
      emitter.emit('connected', client)
    }).on('error', err => {
      if (operation.retry(err)) {
        return emitter.emit('retry', err)
      }
      emitter.emit('timeout', operation.mainError())
    })
  })

  return emitter
}
