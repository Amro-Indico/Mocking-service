import request from 'supertest'
import { app, server } from '../index'
import { info, headers } from './sharedObjects'

describe('this suite is intended to test the authentication and headers', () => {
  beforeAll(() => {
    server.close()
  })

  const endpoint = '/api/v1/albums'

  it('should return 401 (unauthorized) when auth header is not present.', async (done) => {
    const res = await request(app)
      .get(endpoint)
      .set(headers)

    expect(res.status).toBe(401)

    done()
  })

  it('should return 403 (forbidden) when headers are not present.', async (done) => {
    const res = await request(app)
      .get(endpoint)
      .auth('superuser', 'passowrd1.')

    expect(res.status).toBe(403)

    done()
  })
})
