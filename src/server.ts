import { ApolloServer } from 'apollo-server'
import { transformSchema } from './transformSchema'
import { createContext } from './context'
import { getSDL } from './buildSchema'

const server = new ApolloServer({
  schema: transformSchema,
  context: createContext,
})

server.listen().then(({ url }) => {
  getSDL(server)
  console.log(`🚀  Server ready at ${url}`)
})
