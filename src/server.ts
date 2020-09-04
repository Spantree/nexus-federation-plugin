import { ApolloServer } from 'apollo-server'
import { transformSchema } from './transformSchema'
import { createContext } from './context'

const server = new ApolloServer({
  schema: transformSchema,
  context: createContext,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
