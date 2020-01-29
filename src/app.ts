import { createError } from 'http-errors'
import express from 'express'
import logger from 'morgan'
import faker from 'faker'

import api12 from './api/api12'

const app = express()
type AppRequest = express.Request & { id?: string }

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   try {
//     const client = req.socket.getPeerCertificate()
//     if (!client) {
//       next(createError(500, 'Something was wrong the certificate'))
//     }
//     console.log(`\n\tClient '${client.subject.CN}' Authorized`)
//   } catch (err) {}
//   console.log(req.headers)
//   next()
// })

app.use((req: AppRequest, res, next) => {
  if (req.id) {
    return next()
  }
  const hrid = req.headers['request-id'] || req.headers['x-request.id']
  if (hrid) {
    req.id = hrid as any
    return next()
  }
  req.id = faker.random.uuid()
  next()
})
app.use(logger('dev'))

// app.use((req, res, next) => {
//   console.log(
//     '⌛️ recieved request ',
//     req.id,
//     'probably not important, letting it wait a bit...'
//   )
//   // Time sure is taking its sweet time
//   setTimeout(() => next(), 5000)
// })
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/1.2', api12)

// error handler
app.use(function(err, req, res, next) {
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.log('err', err.message, req.headers)
  res.status(err.status || 500, 'saskldj')
  res.send(err.message)
  // res.json({})
})

export default app
