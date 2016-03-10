# when-cnct-ready

I use this in my startup scripts executed in Docker containers so that I can wait for another container's server to be ready before starting the dependent server.

## Install
```
npm install when-cnct-ready
```

## Usage
```javascript
whenCnctReady({
  host: process.env.HOST,
  port: process.env.PORT
}).on('connected', win)
  .on('retry', tryToWin)
  .on('timeout', feelBad)
```

## whenCnctReady(options)

See node's [net.connect](https://nodejs.org/api/net.html#net_net_connect_options_connectionlistener) parameters for connection options.

- `options: object`
  - `retry: `number, 1000` ms to wait before retrying connection
  - `timeout: `number, null` ms to continue retrying before timing out
- **returns**: `eventEmitter`
  - `.on('connected', function() {})`
  - `.on('retry',     function(reason) {})`
  - `.on('timeout',   function() {})`
