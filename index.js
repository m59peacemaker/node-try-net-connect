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
    retries: options.retries,
    minTimeout: options.retry,
    maxTimeout: options.retry
  }

  if (typeof options.retries === 'number'  && options.retries > 0) {
    retryOptions.forever = false
  }

  var emitter = new EventEmitter()

  var operation = retry.operation(retryOptions)

  let shouldStop = false
  operation.attempt(currentAttempt => {
    var client = net.connect(options, () => {
      client.destroy()
      emitter.emit('connected', client)
    }).on('error', err => {
      if (!shouldStop && operation.retry(err)) {
        return emitter.emit('retry', err)
      }
      emitter.emit('timeout', operation.mainError())
    })
  })

  emitter.stop = () => shouldStop = true
  return emitter
}
