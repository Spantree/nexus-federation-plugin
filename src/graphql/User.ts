import { objectType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  keyFields: ['id'],
  fields: {
    id: {
      external: true,
      requires: '',
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
