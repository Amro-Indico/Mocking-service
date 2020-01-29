import express from 'express'
import jsonStorage from '../../../jsonStorage'
import { Router } from 'express'
import assert from 'assert'
import uuid from 'uuid'
export const createNewMedieFileRoute = Router()

const createNewMediaFileInAlbums = (
  req: express.Request,
  res: express.Response
) => {
  const aid = req.params.aid
  const targetAlbum = jsonStorage.read()[aid]
  const fid = uuid()

  if (!targetAlbum) {
    res.status(404).send('The album you are looking for was not found')
    return
  }
  const fileInput = req.body

  try {
    assert(req.body.bucket, 'bucket is required')
    assert(req.body.key, 'key is required')

    if (req.body.metadata) {
      if (req.body.metadata.events) {
        if (req.body.metadata.events[0]) {
          assert(
            req.body.metadata.events[0].startTime,
            'a valid value for startTime is required if you specify events!'
          )
          assert(
            req.body.metadata.events[0].title,
            'a valid value for title is required if you specify events!'
          )
        }
      }
    }

    const newFile = {
      changedBy: {
        id: 'N/A',
        ref: 'N/A',
        system: 'N/A',
      },
      createdBy: {
        id: req.headers['x-onbehalfof'],
        ref: req.headers['kall-id'],
        system: req.headers['system-id'],
      },
      fid: fid,
      medietype: 'sometype',
      fileInput,
      name: 'string',
      representations: [
        {
          audioCodec: 'string',
          creationTime: '2019-12-19T08:15:39.962Z',
          duration: 0,
          errorMessage: 'string',
          etag: 'string',
          fileSize: 0,
          height: 0,
          id: 'string',
          key: 'string',
          link: 'string',
          md5: 'string',
          mimetype: 'string',
          originates: 'string',
          videoCodec: 'string',
          width: 0,
        },
      ],
      streamingLinks: {
        additionalProp1: 'string',
        additionalProp2: 'string',
        additionalProp3: 'string',
      },
      timeChanged: '2019-12-19T08:15:39.962Z',
      timeCreated: '2019-12-19T08:15:39.962Z',
    }

    targetAlbum.medieFiles.push(fid)
    jsonStorage.upsert({ [req.params.aid]: targetAlbum })
    jsonStorage.upsert({ [fid]: newFile })
    res.status(201).send(newFile)
  } catch (err) {
    res.status(404).send(err.message)
  }
}

export default createNewMediaFileInAlbums
