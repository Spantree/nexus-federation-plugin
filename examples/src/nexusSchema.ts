import { makeSchema } from '@nexus/schema'
import * as types from './graphql'
import { nexusPluginFederation } from '@spantree/nexus-federation'

export const nexusSchema = makeSchema({
  types,
  plugins: [nexusPluginFederation],
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
