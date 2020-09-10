import {
  transformSchemaFederation,
  FederationObjectConfig,
} from 'graphql-transform-federation'
import { Context } from './context'
import { nexusSchema } from './nexusSchema'

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
    resolveReference: (root: any, ctx: Context) => any
  }
}

const {
  types: outputTypes,
}: { types: { [key: string]: ObjectType } } = nexusSchema.extensions.nexus
  .config as any

const getTypes = () => {
  let typesObject: { [key: string]: FederationObjectConfig<Context> } = {}
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
  return typesObject
}

export const transformSchema = transformSchemaFederation<Context>(nexusSchema, {
  Query: {
    // Ensure the root queries of this schema show up the combined schema
    extend: true,
  },
  ...getTypes(),
})
