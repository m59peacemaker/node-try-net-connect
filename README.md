# when-cnct-ready

Attempts a server connection and fires callback when successful.

I use this in my startup scripts executed in Docker containers so that I can wait for another container's server to be ready before starting the dependent server.

## Install
```
npm install when-cnct-ready
```

## Usage
```javascript
whenCnctReady({
  host: process.env.SOME_SERVICE_PORT_8080_TCP_ADDR,
  port: process.env.SOME_SERVICE_PORT_8080_TCP_PORT
  service: 'Some Service',
  timeout: 10000
}, function(err) {
  if (!err) {
    win();
  }
});
```

### Parameters

#### opts

See node's [net.connect](https://nodejs.org/api/net.html#net_net_connect_options_connectionlistener) parameters for connection options.

Type: `Object`

    service : The name of the connection being attemted. Used for logging.
      retry : (Number, Default: 1000) Number of ms to wait before retrying connection
    timeout : (Number) Number of ms to wait before failing. The callback will be called with an error message.

#### callback

Type: `Function`
