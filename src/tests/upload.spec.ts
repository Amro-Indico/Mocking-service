import request from 'supertest'
import { app, server } from '../index'
import { headers } from './sharedObjects'

describe('test suite for /.well-known/s3-upload-configuration', () => {
  const endpoint = '/.well-known/s3-upload-configuration'

  beforeAll(() => {
    server.close()
  })

  it('always returns 200.', async (done) => {
    const res = await request(app).get(endpoint)

    expect(res.status).toBe(200)

    done()
  })
})
