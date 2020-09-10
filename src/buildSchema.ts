import { createTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
import { format } from 'prettier'
import { writeFileSync } from 'fs'

const GET_SDL = gql`
  {
    _service {
      sdl
    }
  }
`

export async function getSDL(server) {
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
  writeFileSync('src/generated/transformedSchema.graphql', fileContent)
}
