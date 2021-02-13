import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core'
import { objectType, makeSchema } from 'nexus'
import { nexusPluginFederation, transformSchemaFederation } from '../src/index'
import { join } from 'path'

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('body')
  },
})

const User = objectType({
  name: 'User',
  keyFields: ['id'],
  fieldDirectives: {
    id: {
      external: true,
      requires: 'email name',
    },
    email: {
      external: true,
      requires: 'name',
    },
  },
  resolveReference: (parent, ctx) => {},
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('email')
    t.string('name')
  },
})

const schema = makeSchema({
  types: [User, Post],
  plugins: [nexusPluginFederation],
  outputs: {
    schema: false,
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: join(__dirname, 'server.ts'),
    export: 'Context',
  },
})

export interface Context {
  db: {
    users: {
      id: string
      name: string
      email: string
    }[]
    posts: {
      id: string
      body: string
    }[]
  }
}

const db: Context['db'] = { users: [], posts: [] }

function createContext(): Context {
  return {
    db,
  }
}

export const server = new ApolloServer({
  schema: transformSchemaFederation(schema),
  context: createContext,
  plugins: [ApolloServerPluginInlineTraceDisabled()],
})
