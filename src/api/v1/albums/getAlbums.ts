import express from 'express'
import jsonStorage from '../../../jsonStorage'
import { Router } from 'express'
export const getAllAlbumsRoute = Router()

const getAlbums = (req: express.Request, res: express.Response) => {
  const createdBy = req.query['createdby']
  const title = req.query['title']

  const targetobject = jsonStorage.read()

  const arr = Object.values(targetobject)

  const targetelements = arr.filter(function(item: any) {
    if (title) {
      if (item.metadata.title !== title) {
        return false
      }
    }
    if (createdBy) {
      if (item.createdBy.id !== createdBy) {
        return false
      }
    }

    return true
  })

  console.log(targetobject)

  if (!targetelements) {
    res.send(targetobject).status(200)
    return
  }

  res.send(targetelements).status(200)
}

export default getAlbums
