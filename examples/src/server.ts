import { ApolloServer } from 'apollo-server'
import {
  transformSchemaFederation,
  printTransformedSchema,
} from '@spantree/nexus-federation'
import { createContext } from './context'
import { nexusSchema } from './nexusSchema'

const server = new ApolloServer({
  schema: transformSchemaFederation(nexusSchema),
  context: createContext,
})

server.listen().then(({ url }) => {
  printTransformedSchema(server)
  console.log(`🚀  Server ready at ${url}`)
})
