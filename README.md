## @spantree/nexus-federation

It's a private nexus plugin package for make integration between nexus schema and apollo federation

### Install

You must have an account in @spantree Org to install this plugin

```shell
yarn add @spantree/nexus-federation
or
npm i @spantree/nexus-federation
```

## API

#### nexus plugin

```ts
import { makeSchema } from '@nexus/schema'
import { nexusPluginFederation } from '@spantree/nexus-federation'

export const nexusSchema = makeSchema({
  types,
  plugins: [nexusPluginFederation], // add plugin here
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    sources: [
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
    contextType: 'Context.Context',
  },
})
```

#### Transform nexus schema to Federation

```ts
import { ApolloServer } from 'apollo-server'
import {
  transformSchemaFederation,
  printTransformedSchema,
} from '@spantree/nexus-federation'
import { createContext } from './context'
// import nexus schema
import { nexusSchema } from './nexusSchema'

const server = new ApolloServer({
  // warp nexus schema with our function
  schema: transformSchemaFederation(nexusSchema),
  context: createContext,
})

server.listen().then(({ url }) => {
  // you can print Transformed Schema with our function
  // it's take two args
  // 1- server instance
  // 2- create file path default `src/generated`
  printTransformedSchema(server)
  console.log(`🚀  Server ready at ${url}`)
})
```

### Usage

Like [graphql-transform-federation](https://github.com/0xR/graphql-transform-federation#usage) you can pass configration to nexus `objectType`

```ts
import { objectType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  keyFields: ['id'],
  fieldDirectives: {
    id: {
      external: true,
      requires: 'email name',
    },
    email: {
      external: true,
    },
  },
  resolveReference: (parent, ctx) => {},
  definition(t) {
    t.int('id', { nullable: false })
    t.string('email', { nullable: false })
    t.string('name', { nullable: true })
  },
})
```
