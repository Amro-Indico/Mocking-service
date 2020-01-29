import express from 'express'
import { Router } from 'express'
import jsonStorage from '../../../jsonStorage'
import assert from 'assert'
export const updateAlbumMetadataRoute = Router()

const updateMetadataOnFile = (req: express.Request, res: express.Response) => {
  const aid = req.params.aid
  const input = req.body

  const targetAlbum = jsonStorage.read()[aid]

  if (!targetAlbum) {
    res.status(404).send('The album you are looking for was not found')
    return
  }

  try {
    assert(input.title, 'Title is required')
    assert(input.authorization, 'authorization is required')

    if (input.usage) {
      const usagedata: any = input.usage[0]
      assert(
        usagedata['system'],
        'usage is defined. You need to specify the property system'
      )
      assert(
        usagedata['ref'],
        'usage is defined. You need to specify the property ref'
      )

      targetAlbum.metadata.usage = input.usage
    }

    console.log(targetAlbum.metadata)

    if (input.authorization) {
      targetAlbum.metadata.authorization = input.authorization
    }
    if (input.description) {
      targetAlbum.metadata.description = input.description
    }
    if (input.tags) {
      targetAlbum.metadata.tags = input.tags
    }
    if (input.title) {
      targetAlbum.metadata.title = input.title
    }

    jsonStorage.upsert({ [aid]: targetAlbum })

    res.status(200).send(targetAlbum)
  } catch (err) {
    res.status(404).send(err.message)
    return
  }
}

export default updateMetadataOnFile
