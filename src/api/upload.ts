import express from 'express'
import { Router } from 'express'
export const uploadRoute = Router()

const endpoint = process.env.ENDPOINT || 'http://localhost:9000'
const bucket = process.env.BUCKET || 'mediebank-test-temp'
const accessKey = process.env.ACCESS_KEY || 'admin'
const secretKey = process.env.SECRET_KEY || 'secretsecret'

const uploadFile = (req: express.Request, res: express.Response) => {
  const targetObject = {
    endpoint,
    bucket,
    accessKey,
    secretKey
  }

  res.send(targetObject).status(200)
}

uploadRoute.get('/', uploadFile)
