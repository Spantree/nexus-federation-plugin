import {
  transformSchemaFederation as transformSchemaFederation2,
  FederationObjectConfig,
} from 'graphql-transform-federation'
import { NexusGraphQLSchema, isNexusObjectTypeDef } from 'nexus/dist/core'

import chalk from 'chalk'

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

/**
 * Get only the Nexus Object Type. This is an any for simplicity of developer experience, if it's an array we get
 * the values, if it's an nested objects or arrays we flatten out the valid types, ignoring invalid ones.
 */
const getOutputTypes = (types: any): ObjectType[] => {
  let result = []

  const flattenTypes = (t) => {
    if (isNexusObjectTypeDef(t)) {
      result.push(t)
    } else if (Array.isArray(t)) {
      t.forEach((type) => flattenTypes(type))
    } else if (typeof t === 'object') {
      Object.values(t).forEach((type) => flattenTypes(type))
    }
  }

  flattenTypes(types)

  return result
}

export function transformSchemaFederation(schema: NexusGraphQLSchema) {
  let { types: outputTypes }: { types: ObjectType[] } = schema.extensions.nexus
    .config as any
  let typesObject: { [key: string]: FederationObjectConfig<any> } = {}

  outputTypes = getOutputTypes(outputTypes)

  Object.keys(outputTypes).forEach((key) => {
    const config = outputTypes[key].config

    if (config && config.keyFields && config.keyFields.length > 0) {
      Object.keys(config.fieldDirectives).forEach((field) => {
        const fieldConfig = config.fieldDirectives[field]
        if (fieldConfig.requires === '') {
          console.log(
            `${chalk.yellow('Warning:')} ${chalk.green(
              'requires',
            )} field empty: ${chalk.blue(field)} at ${chalk.cyanBright(
              config.name,
            )} type`,
          )
        }

        if (fieldConfig.provides === '') {
          console.log(
            `${chalk.yellow('Warning:')} ${chalk.green(
              'provides',
            )} field empty: ${chalk.blue(field)} at ${chalk.cyanBright(
              config.name,
            )} type`,
          )
        }
      })

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
  })

  return transformSchemaFederation2<any>(schema, {
    Query: {
      extend: true,
    },
    ...typesObject,
  })
}
