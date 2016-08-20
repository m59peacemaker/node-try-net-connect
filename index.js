const net = require('net')
const {EventEmitter} = require('events')
const retry = require('retry')

const defaults = {
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

  const emitter = new EventEmitter()

  const operation = retry.operation(retryOptions)

  operation.attempt(currentAttempt => {
    const client = net.connect(options, () => {
      client.destroy()
      emitter.emit('connected', client)
    }).on('error', err => {
      if (operation.retry(err)) {
        return emitter.emit('retry', err)
      }
      emitter.emit('timeout', operation.mainError())
    })
  })

  emitter.stop = () => operation.stop()
  return emitter
}
