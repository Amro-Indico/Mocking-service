import { updateAlbumMetadataRoute } from './api/v1/albums/updateMetadataOnFile'
import { getAllAlbumsRoute } from './api/v1/albums/getAlbums'
import { uploadRoute } from './api/upload'
import { createNewMedieFileRoute } from './api/v2/albums/createNewMediaFileInAlbum'
import { createNewAlbumRoute } from './api/v1/albums/createNewAlbum'
import basicAuth from 'express-basic-auth'
import jsonStorage from './jsonStorage'
import api from './api'
import chalk from 'chalk'
import express from 'express'
import app from './app'
import requestLogger from './requestLogger'
import path from 'path'
import https from 'https'
import fs from 'fs'

const certDir = path.join(__dirname, 'cert')
const port = process.env.PORT || '5678'
const storage = jsonStorage
app.set('port', port)
const MPORT = process.env.MPORT || 6756
storage.init()
app.use(express.json())

if (process.env.NODE_ENV != 'test') {
  app.use(requestLogger)
}
//get
app.use('/.well-known/s3-upload-configuration', uploadRoute)

app.use(
  basicAuth({
    users: {
      //username: password
      admin: 'supersecret',
      superuser: 'passowrd1.',
      normaluser: 'password5M.'
    }
  })
)

app.use(function(req, res, next) {
  const bid = req.headers['x-onbehalfof']
  const systemId = req.headers['system-id']
  const kallId = req.headers['kall-id']

  if (!bid) {
    res.status(403).send('You must supply a header called x-onbehalfof')
    return
  } else if (!systemId) {
    res.status(403).send('You must supply a header called system-id')
    return
  } else if (!kallId) {
    res.status(403).send('Please specify a kall-id.')
    return
  }

  next()
})

//post //add new media file
app.use('/', createNewMedieFileRoute)
//post //add new Album
app.use('/', createNewAlbumRoute)

//get get specific album with aid
app.use('/', api)

//get get all albums in the database within specific search params
app.use('/', getAllAlbumsRoute)

//put update an album's metadata
app.use('/', updateAlbumMetadataRoute)

app.listen(MPORT, () => {
  console.log(chalk`HTTP Listening on port: {blue ${MPORT}}`)
})

/** this isn't working */

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

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
  console.debug('HTTPS Listening on port:', chalk`{blue ${port}}`)
}

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
