import { gql } from 'apollo-server'
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing'

import { server } from './server'

describe('Integration tests', () => {
  let client: ApolloServerTestClient
  let result: any

  beforeAll(async () => {
    client = createTestClient(server)
    const query = gql`
      query {
        _service {
          sdl
        }
      }
    `

    result = await client.query({ query })
  })

  test('schema should contain type User with id key', async () => {
    expect(result.data._service.sdl).toContain('type User @key(fields: "id")')
  })

  test('schema should contain id field with @external @requires', async () => {
    expect(result.data._service.sdl).toContain(
      'id: Int! @external @requires(fields: "email name")',
    )
  })

  test('schema should contain email field with @external', async () => {
    expect(result.data._service.sdl).toContain('email: String! @external')
  })
})
