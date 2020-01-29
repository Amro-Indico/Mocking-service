import jsonStorage from '../jsonStorage'
import datefns from 'date-fns'
import mkdirp from 'mkdirp'
import { Router } from 'express'
import assert from 'assert'
import faker from 'faker'
import filesize from 'filesize'
import fs from 'fs'
import path from 'path'

const outFolder = 'uploads'
const router = Router()
const containerName = 'viroux01'
jsonStorage.init()
const dateFormat = 'yyyy-MM-dd HH:mm:SS' // 'cous who needs timezones anyway? I'm sure this will never be a problem...
const formatDate = (date: any) => {
  return datefns.format(date || new Date(), dateFormat)
}
mkdirp.sync(outFolder)
router.get('/objects/:consumerId/:contextId/:objectId/info', (req, res) => {
  const { objectId, contextId, consumerId } = req.params
  const { [objectId]: object } = jsonStorage.read()
  try {
    assert(!!object, 'no object')
    assert(object.objectId === objectId, 'objectId mismatch')
    assert(object.consumerId === consumerId, 'consumerId mismatch')
    assert(object.contextId === contextId, 'contextId mismatch')
  } catch (err) {
    return res.status(500).json({ err, message: err.message, object })
  }
  return res.json(object)
})
router.put('/objects/:consumerId/:contextId', function(req, res, next) {
  const { headers } = req
  const objectId = faker.random.uuid()
  const { consumerId, contextId } = req.params
  const {
    name,
    'content-length': contentLength,
    contenttype: contentType,
    groupname: groupName,
    userid: userId,
    description,
    replaces,
    businessmetadata: businessMetadata,
    metadata,
    md5checksum: md5Checksum,
    upptagningstyp,
    ingivenupprattad: ingivenUpprattad,
    ingivenupprattadav: ingivenUpprattadAv,
    ingivenupprattaddatum: ingivenUpprattadDatum,
    locationinfo: locationInfo,
    copyrightinf: copyrightInfo
  } = headers
  const date = new Date()
  const formattedDate = formatDate(date)
  const recordRaw = {
    consumerId,
    contextId,
    objectId,
    containerName,
    replaces,
    replacedBy: '',
    path: `/${containerName}/${consumerId}/${contextId}/${objectId}`,
    originalName: name,
    contentLength,
    contentType,
    created: formattedDate,
    modified: formattedDate,
    virouxUrl: `/objects/${consumerId}/${contextId}/${objectId}`,
    metadata: metadata || [],
    businessMetadata: businessMetadata || [],
    displayName: name,
    description,
    userId,
    groupName,
    locationInfo,
    copyrightInfo,
    rotation: 0,
    md5Checksum,
    createdFormatted: formattedDate,
    modifiedFormated: formattedDate,
    contentLengthFormatted: `${headers['content-length']} bytes (lots of kB)`,
    upptagningstyp,
    ingivenUpprattad,
    ingivenUpprattadAv
  }
  const record = Object.keys(recordRaw).reduce((r, key) => {
    const value = recordRaw[key]
    r[key] = value === undefined ? '' : value
    return r
  }, {})

  const filePath = path.join(outFolder, record['path'])
  try {
    const requiredContentType = 'application/octet-stream'
    assert(
      headers['content-type'] === requiredContentType,
      `content-type-error, must be '${requiredContentType}'. To specify the actual content-type of the file, please use the contentType-header (no hyphen)`
    )
    for (const header of [
      'consumerId',
      'contextId',
      'originalName',
      'groupName',
      'contentType',
      'userId',
      'displayName'
    ]) {
      assert(!!record[header], `'${header}' not set`)
    }
    const relative = path.relative(outFolder, filePath)
    assert(
      relative && !relative.startsWith('..') && !path.isAbsolute(relative),
      `folder not within ${outFolder}, was ${filePath} `
    )
  } catch (err) {
    console.error(err)
    return next(err)
    return res.status(500).json({ err, message: err.message, headers, record })
  }
  mkdirp.sync(path.join(filePath, '../'))
  const writeStream: any = fs.createWriteStream(filePath)
  const interval = setInterval(() => {
    const progress: any = writeStream.bytesWritten / Number(contentLength)
    console.log(
      `${filesize(writeStream.bytesWritten)} of ${filesize(
        Number(contentLength)
      )}, ${(progress * 100).toFixed(2)}%`
    )
  }, 1000)
  writeStream.on('error', function(err) {
    console.log('writestream', err)
    clearInterval(interval)
  })
  writeStream.on('finish', async function() {
    const stats = fs.statSync(filePath)
    if (!stats.size) {
      // cleanup file
      fs.unlinkSync(filePath)
      clearInterval(interval)
      return res.status(500).send({ message: 'File was empty' })
    }
    console.log('=req don', req.params, req.headers, record)
    jsonStorage.upsert({ [objectId]: record })

    return res.json(record)
  })
  const pipe = req.pipe(writeStream)
  // req.on('data', () => console.log('got data'))
  req.on('end', () => {
    clearInterval(interval)
  })
  req.on('aborted', () => {
    clearInterval(interval)
    console.log('req aborted')
  })
})

export default router
