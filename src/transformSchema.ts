import {
  transformSchemaFederation as transformSchemaFederation2,
  FederationObjectConfig,
} from 'graphql-transform-federation'
import { NexusGraphQLSchema } from '@nexus/schema/dist/core'

interface ObjectType {
  name: string
  config: {
    type: string
    name: string
    extend: boolean
    keyFields: string[]
    fieldDirectives: {
      [key: string]: {
        external?: boolean
        provides?: string
        requires?: string
      }
    }
    resolveReference: (root: any, ctx: any) => any
  }
}

export function transformSchemaFederation(schema: NexusGraphQLSchema) {
  const {
    types: outputTypes,
  }: { types: { [key: string]: ObjectType } } = schema.extensions.nexus
    .config as any

  let typesObject: { [key: string]: FederationObjectConfig<any> } = {}

  Object.keys(outputTypes).forEach((key) => {
    const config = outputTypes[key].config
    if (!['Query', 'Mutation'].includes(config.name)) {
      if (config.keyFields && config.keyFields.length > 0) {
        typesObject = {
          ...typesObject,
          [config.name]: {
            keyFields: config.keyFields,
            resolveReference: config.resolveReference,
            extend: config.extend,
            fields: config.fieldDirectives,
          },
        }
      }
    }
  })

  return transformSchemaFederation2<any>(schema, {
    Query: {
      extend: true,
    },
    ...typesObject,
  })
}
