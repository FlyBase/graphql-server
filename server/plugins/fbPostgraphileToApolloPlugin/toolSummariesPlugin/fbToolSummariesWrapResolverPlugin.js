import { makeWrapResolversPlugin } from 'graphile-utils'
import { loadFacts, summarize } from './batchedToolSummaries'

const FIELDS = new Set([
  'insertedElementTypes',
  'regRegions',
  'alsoCarries',
  'taggedWith',
  'tagUses',
  'encodedTools',
  'encodedToolUses',
])

module.exports = makeWrapResolversPlugin(
  (context) => {
    const fieldName = context.scope.fieldName
    if (!FIELDS.has(fieldName)) return null
    const typename = context.scope.pgIntrospection.name
    if (typename !== 'allele' && typename !== 'insertion') return null
    return { typename, fieldName }
  },
  ({ typename, fieldName }) => ({
    requires: {
      siblingColumns: [
        ...(typename === 'allele'
          ? [
              {
                column: 'propagate_transgenic_uses',
                alias: '$propagateTransgenicUses',
              },
              { column: 'is_construct', alias: '$isConstruct' },
            ]
          : []),
        { column: 'id', alias: '$parentId' },
      ],
    },
    resolve: async (_resolver, parent, _args, context) => {
      const id = parent.__identifiers
        ? parent.__identifiers[0]
        : parent.$parentId
      const { $propagateTransgenicUses = true, $isConstruct } = parent
      const facts = await loadFacts(context, typename, id)
      return summarize(
        facts,
        typename,
        fieldName,
        $propagateTransgenicUses,
        $isConstruct
      )
    },
  })
)
