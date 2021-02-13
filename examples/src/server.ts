import { ApolloServer } from 'apollo-server'
import {
  transformSchemaFederation,
  printTransformedSchema,
} from 'nexus-federation-plugin'
import { createContext } from './context'
import { nexusSchema } from './nexusSchema'
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core'

const server = new ApolloServer({
  schema: transformSchemaFederation(nexusSchema),
  context: createContext,
  plugins: [ApolloServerPluginInlineTraceDisabled()],
})

server.listen().then(({ url }) => {
  printTransformedSchema(server)
  console.log(`🚀  Server ready at ${url}`)
})
