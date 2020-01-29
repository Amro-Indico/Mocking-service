#!/usr/bin/env node

import app from './app'
import https from 'https'
import path from 'path'
import fs from 'fs'

const certDir = path.join(__dirname, 'cert')
const port = process.env.PORT || '5678'

app.set('port', port)

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(certDir, 'server', 'all.key')),
    cert: fs.readFileSync(path.join(certDir, 'server', 'all.crt')),
    ca: fs.readFileSync(path.join(certDir, 'client', 'ca.crt')),
    requestCert: true,
    rejectUnauthorized: true,
    passphrase: 'password'
  },
  app
)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

console.log('starting...')

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
  console.debug('Listening on ' + bind)
}
