import { createTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
import { format } from 'prettier'
import { writeFileSync, mkdirSync } from 'fs'
import { ApolloServer } from 'apollo-server'
import { join } from 'path'

const GET_SDL = gql`
  {
    _service {
      sdl
    }
  }
`

export async function printTransformedSchema(
  server: ApolloServer,
  path = 'src/generated/',
) {
  const { query } = createTestClient(server)
  const result = await query({
    query: GET_SDL,
  })

  const fileContent = format(result.data._service.sdl, {
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 2,
    parser: 'graphql',
  })

  mkdirSync(path, { recursive: true })
  writeFileSync(join(path, 'transformedSchema.graphql'), fileContent)
}
