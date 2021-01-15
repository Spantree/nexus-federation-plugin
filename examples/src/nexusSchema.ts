import { makeSchema } from 'nexus'
import * as types from './graphql'
import { nexusPluginFederation } from 'nexus-federation-plugin'
import { join } from 'path'

export const nexusSchema = makeSchema({
  types,
  plugins: [nexusPluginFederation],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: join(__dirname, 'context.ts'),
    export: 'Context',
  },
})
