var net = require('net')
var EventEmitter = require('events').EventEmitter

var defaults = {
  retry: 1000,
  timeout: null
}

module.exports = function(options) {
  options = Object.assign({}, defaults, options)
  var emitter = new EventEmitter()

  var shouldTimeout = false
  if (options.timeout) {
    setTimeout(function() {
      shouldTimeout = true
    }, options.timeout)
  }

  function attemptConnection(reason) {
    emitter.emit('retry', reason)
    var client = net.connect(options, function() {
      client.destroy()
      emitter.emit('connected')
    }).on('error', function(err) {
      if (shouldTimeout) {
        emitter.emit('timeout', err)
      } else {
        setTimeout(function() {
          attemptConnection(err)
        }, options.retry)
      }
    })
  }

  attemptConnection()

  return emitter
}
