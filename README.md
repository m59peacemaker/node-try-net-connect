# try-net-connect

I use this in my startup scripts executed in Docker containers so that I can wait for another container's server to be ready before starting the dependent server.

## Install
```
npm install try-net-connect
```

## Usage
```javascript
const tryConnect = require('try-net-connect')

tryConnect({
  host: process.env.HOST,
  port: process.env.PORT
}).on('connected', win)
  .on('retry', tryToWin)
  .on('timeout', feelBad)
```

## tryConnect(options)

See node's [net.connect](https://nodejs.org/api/net.html#net_net_connect_options_connectionlistener) parameters for connection options.

- `options: object`
  - `retry:   number, 1000` ms to wait before retrying connection
  - `retries: number, null (infinite)` number of retries
- **returns**: `eventEmitter`
  - `.on('connected', client => {})`
  - `.on('retry',     reason => {})`
  - `.on('timeout',   mainReason => {})`
  - `stop: function` stop retrying
