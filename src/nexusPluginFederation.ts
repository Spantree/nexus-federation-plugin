import { plugin } from 'nexus'
import { printedGenTyping, printedGenTypingImport } from 'nexus/dist/utils'
import { SourceValue, GetGen } from 'nexus/dist/core'

const KeyFieldsImport = printedGenTypingImport({
  module: 'nexus-federation-plugin',
  bindings: ['KeyFields'],
})

const ObjectTypeFieldsImport = printedGenTypingImport({
  module: 'nexus-federation-plugin',
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
  name: 'fieldDirectives',
  description: `
  Fields options
  `,
  type: 'ObjectTypeFields<TypeName>',
  imports: [ObjectTypeFieldsImport],
})

const ResolveReferenceImport = printedGenTypingImport({
  module: 'nexus-federation-plugin',
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
  root: SourceValue<TypeName>,
  context: GetGen<'context'>,
) => any

export type KeyFields<TypeName extends string> = (keyof SourceValue<TypeName>)[]

export type ObjectTypeFields<TypeName extends string> = {
  [key in keyof SourceValue<TypeName>]?: {
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
