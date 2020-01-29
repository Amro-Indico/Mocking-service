import request from 'supertest'
import { app, server } from '../index'
import { info, headers } from './sharedObjects'

describe('test suite for POST /api/v1/albums', () => {
  const endpoint = '/api/v1/albums'

  beforeAll(() => {
    server.close()
  })

  it('should return 201 (Created) when new album has been created', async (done) => {
    const res = await request(app)
      .post(endpoint)
      .send(info)
      .set(headers)
      .auth('superuser', 'passowrd1.')

    expect(res.status).toBe(201)

    done()
  })

  it('should return 404 (Not found) when body data is not present', async (done) => {
    const res = await request(app)
      .post(endpoint)
      .set(headers)
      .auth('superuser', 'passowrd1.')

    expect(res.status).toBe(404)

    done()
  })
})
