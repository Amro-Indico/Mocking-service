import express from 'express'
import jsonStorage from '../../../jsonStorage'
import { Router } from 'express'
import exampleResponse from '../../templates'

const getFilesInAlbum = (req: express.Request, res: express.Response) => {
  const aid = req.params.aid
  const data = jsonStorage.read()
  const targetAlbum = data[aid]

  if (!targetAlbum) {
    res.status(404).send('target album not found')
    return
  }
  targetAlbum.medieFiles = targetAlbum.medieFiles.map((id: string) => data[id])

  res.status(200).send(targetAlbum)
}

export default getFilesInAlbum
