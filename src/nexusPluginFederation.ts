import { plugin } from '@nexus/schema'
import {
  printedGenTyping,
  printedGenTypingImport,
} from '@nexus/schema/dist/utils'
import { RootValue, GetGen } from '@nexus/schema/dist/core'

const KeyFieldsImport = printedGenTypingImport({
  module: '../nexusPluginFederation',
  bindings: ['KeyFields'],
})

const ObjectTypeFieldsImport = printedGenTypingImport({
  module: '../nexusPluginFederation',
  bindings: ['ObjectTypeFields'],
})

const keyFields = printedGenTyping({
  optional: true,
  name: 'keyFields',
  description: `
  keyFields
  `,
  type: 'KeyFields<TypeName>',
  imports: [KeyFieldsImport],
})

const extendOption = printedGenTyping({
  optional: true,
  name: 'extend',
  description: `
  extends type
  `,
  type: 'boolean',
})

const fieldsOptions = printedGenTyping({
  optional: true,
  name: 'fields',
  description: `
  Fields options
  `,
  type: 'ObjectTypeFields<TypeName>',
  imports: [ObjectTypeFieldsImport],
})

const ResolveReferenceImport = printedGenTypingImport({
  module: '../nexusPluginFederation',
  bindings: ['ResolveReference'],
})

const resolveReference = printedGenTyping({
  optional: true,
  name: 'resolveReference',
  description: `
  Resolve Reference
  `,
  type: 'ResolveReference<TypeName>',
  imports: [ResolveReferenceImport],
})

export type ResolveReference<TypeName extends string> = (
  root: RootValue<TypeName>,
  context: GetGen<'context'>,
) => any

export type KeyFields<TypeName extends string> = (keyof RootValue<TypeName>)[]

export type ObjectTypeFields<TypeName extends string> = {
  [key in keyof RootValue<TypeName>]?: {
    external?: boolean
    provides?: string
    requires?: string
  }
}

export const nexusPluginFederation = plugin({
  name: 'nexusPluginFederation',
  objectTypeDefTypes: [
    keyFields,
    extendOption,
    fieldsOptions,
    resolveReference,
  ],
})
