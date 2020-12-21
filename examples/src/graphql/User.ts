import { objectType } from 'nexus'

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
    t.nonNull.int('id')
    t.nonNull.string('email')
    t.string('name')
  },
})
