import { objectType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  keyFields: ['id'],
  fieldDirectives: {
    id: {
      external: true,
      requires: 'email name',
      provides: '',
    },
    email: {
      external: true,
      requires: '',
    },
  },
  resolveReference: (parent, ctx) => {},
  definition(t) {
    t.int('id', { nullable: false })
    t.string('email', { nullable: false })
    t.string('name', { nullable: true })
  },
})
