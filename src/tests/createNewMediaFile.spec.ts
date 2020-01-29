import request from 'supertest'
import { app, server } from '../index'
import { testobj, headers } from './sharedObjects'
import jsonStorage from '../jsonStorage'

describe('test suite for POST /api/v2/albums/:aid/files', () => {
  const db = jsonStorage.read()
  const firstAlbumAid: any = Object.keys(db).find(item => !!db[item]?.aid)
  if (!firstAlbumAid) {
    throw new Error('Could not find any albums in db.')
  }
  const endpoint = `/api/v2/albums/${firstAlbumAid}/files`

  beforeAll(() => {
    server.close()
  })

  it('Should return 201 (Created) when new file has been created successfully', async done => {
    const res = await request(app)
      .post(endpoint)
      .send(testobj)
      .set(headers)
      .auth('superuser', 'passowrd1.')

    expect(res.status).toBe(201)

    done()
  })

  it('should retard 404 if aid doe not exist in database.', async done => {
    const res = await request(app)
      .post('/api/v2/albums/testinghere/files')
      .send(testobj)
      .set(headers)
      .auth('superuser', 'passowrd1.')

    expect(res.status).toBe(404)

    done()
  })
})
