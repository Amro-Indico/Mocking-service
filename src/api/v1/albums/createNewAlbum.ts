import assert from 'assert'
import uuid from 'uuid'
import DataObject from '../../../dataFormat'
import express from 'express'
import jsonStorage from '../../../jsonStorage'
import { Router } from 'express'
import albumTemplate from '../../templates'
export const createNewAlbumRoute = Router()
const storage = jsonStorage

const createNewAlbum = (req: express.Request, res: express.Response) => {
  const aid = uuid()
  const xonbehalfof = req.headers['x-onbehalfof'] || 'someuser'

  const bodyData: DataObject = {
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    usage: req.body.usage,
    authorization: req.body.authorization,
  }

  const newdata: Object = albumTemplate(
    aid,
    req.body.title,
    req.body.description,
    req.body.tags,
    req.body.usage,
    req.body.authorization,
    xonbehalfof,
    req.headers['system-id']
  )

  const data = { [aid]: newdata }

  try {
    assert(bodyData.title, 'Title is missing, please add title.')
    assert(
      bodyData.authorization && Object.keys(bodyData.authorization).length > 0,
      'Authorization object is missing, please add at least 1 element.'
    )

    if (bodyData.usage) {
      const usagedata: any = bodyData.usage[0]

      assert(
        usagedata['system'],
        'usage is defined. You need to specify the property system'
      )
      assert(
        usagedata['ref'],
        'usage is defined. You need to specify the property ref'
      )
    }

    storage.upsert(data)

    res.status(201).json(newdata)
  } catch (err) {
    res.status(404).send({ error: err.message })
  }
}

export default createNewAlbum
