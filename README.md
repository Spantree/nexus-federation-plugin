## nexus-federation-plugin

A [Nexus](https://nexusjs.org/) plugin to integrate
[Apollo Federation](https://www.apollographql.com/docs/federation/)
with [Nexus Schema](https://nexusjs.org/docs/guides/schema).

### Install

```shell
yarn add nexus-federation-plugin
or
npm i nexus-federation-plugin
```

## API

#### nexus plugin

```ts
import { makeSchema } from 'nexus'
import { nexusPluginFederation } from 'nexus-federation-plugin'

export const nexusSchema = makeSchema({
  types,
  plugins: [nexusPluginFederation], // add plugin here
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: join(__dirname, 'context.ts'),
    export: 'Context',
  },
})
```

#### Transform nexus schema to Federation

```ts
import { ApolloServer } from 'apollo-server'
import {
  transformSchemaFederation,
  printTransformedSchema,
} from 'nexus-federation-plugin'

import { createContext } from './context'
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
import { objectType } from 'nexus'

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
    t.nonNull.int('id')
    t.nonNull.string('email')
    t.string('name')
  },
})
```
