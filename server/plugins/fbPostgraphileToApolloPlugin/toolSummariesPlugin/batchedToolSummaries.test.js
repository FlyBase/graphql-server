'use strict'
const assert = require('assert')
const fs = require('fs')
const vm = require('vm')
const {
  summarize,
  createLoader,
  loadFacts,
  BATCH_SIZE,
} = require('./batchedToolSummaries')
// Execute the unchanged legacy flatteners as the semantic oracle.
const legacy = fs
  .readFileSync(__dirname + '/helpers.js', 'utf8')
  .replace(/export const /g, 'var ')
const scope = {}
vm.runInNewContext(legacy, scope)
const relations = {
  regRegions: 'has_reg_region',
  alsoCarries: 'carries_tool',
  taggedWith: 'tagged_with',
  tagUses: 'tagged_with',
  encodedTools: 'encodes_tool',
  encodedToolUses: 'encodes_tool',
}
const fields = ['insertedElementTypes', ...Object.keys(relations)]
function branch(n) {
  return {
    tools: Object.values(relations).map((r, i) => ({
      id: 'FBto' + i,
      symbol: n,
      relType: r,
      uses: [{ id: 'FBcv' + i, name: n }],
    })),
    toolUses: [{ id: 'FBcv0', name: n }],
  }
}
const facts = Object.assign(branch('direct'), {
  insertions: [{ constructs: [branch('insertion1'), branch('insertion2')] }],
  constructs: [branch('construct')],
  gene: { id: 'FBgn1', symbol: 'fallback' },
})
function old(facts, type, field, propagate, isConstruct) {
  const project = (b) =>
    field === 'insertedElementTypes'
      ? { toolUses: b.toolUses }
      : {
          tools: b.tools
            .filter((t) => t.relType === relations[field])
            .map((t) =>
              Object.assign(
                { id: t.id, symbol: t.symbol },
                /Uses$/.test(field) ? { toolUses: t.uses } : {}
              )
            ),
        }
  const data = type === 'allele' ? project(facts) : {}
  if (propagate) {
    if (type === 'allele')
      data.insertions = (facts.insertions || []).map((i) => ({
        constructs: i.constructs.map(project),
      }))
    data.constructs = (facts.constructs || []).map(project)
  }
  const result = (
    field === 'insertedElementTypes' || /Uses$/.test(field)
      ? scope.getToolUsesRecursive
      : scope.getToolsRecursive
  )(data)
  return field === 'encodedTools' &&
    !result.length &&
    type === 'allele' &&
    isConstruct
    ? [facts.gene]
    : result
}
async function checkResolverAdapter() {
  const source = fs
    .readFileSync(__dirname + '/fbToolSummariesWrapResolverPlugin.js', 'utf8')
    .replace(
      "import { makeWrapResolversPlugin } from 'graphile-utils'",
      'const makeWrapResolversPlugin=(filter,wrap)=>({filter,wrap})'
    )
    .replace(
      "import { loadFacts, summarize } from './batchedToolSummaries'",
      "const {loadFacts,summarize}=require('./batchedToolSummaries')"
    )
  const sandbox = { module: { exports: {} }, require }
  vm.runInNewContext(source, sandbox)
  const plugin = sandbox.module.exports
  for (const parent of [{ $parentId: 42 }, { __identifiers: [42] }]) {
    const config = plugin.filter({
      scope: { fieldName: 'encodedTools', pgIntrospection: { name: 'allele' } },
    })
    const resolver = plugin.wrap(config)
    const context = {
      pgClient: {
        query: async (sql, args) => {
          assert.strictEqual(args[0][0], '42')
          return {
            rows: [
              {
                id: '42',
                facts: {
                  tools: [],
                  toolUses: [],
                  insertions: [],
                  constructs: [],
                  gene: { id: 'FBgn1', symbol: 'fallback' },
                },
              },
            ],
          }
        },
      },
    }
    const result = await resolver.resolve(
      null,
      Object.assign({ $isConstruct: true }, parent),
      {},
      context
    )
    assert.deepStrictEqual(result, [{ id: 'FBgn1', symbol: 'fallback' }])
  }
}
async function main() {
  await checkResolverAdapter()
  let cases = 0
  for (const type of ['allele', 'insertion'])
    for (const field of fields)
      for (const propagate of [true, false, null])
        for (const isConstruct of [true, false]) {
          for (const f of [
            facts,
            {
              tools: [],
              toolUses: [],
              insertions: [],
              constructs: [],
              gene: null,
            },
          ]) {
            const a = summarize(f, type, field, propagate, isConstruct),
              b = old(f, type, field, propagate, isConstruct)
            assert.strictEqual(
              JSON.stringify(a),
              JSON.stringify(b),
              [type, field, propagate, isConstruct].join('/')
            )
            cases++
          }
        }
  const calls = []
  const client = {
    query: async (sql, args) => {
      calls.push({ sql, args })
      return { rows: args[0].map((id) => ({ id, facts: { id } })) }
    },
  }
  const load = createLoader(client),
    promises = []
  for (let i = 1; i <= BATCH_SIZE * 2 + 1; i++)
    for (let field = 0; field < 7; field++) promises.push(load('allele', i))
  assert.strictEqual(load('allele', 1), load('allele', '1'))
  promises.push(load('insertion', 1))
  await Promise.all(promises)
  assert.strictEqual(calls.length, 4)
  assert.deepStrictEqual(
    calls.map((c) => c.args[0].length),
    [100, 100, 1, 1]
  )
  await load('allele', 1)
  assert.strictEqual(calls.length, 4)
  await assert.rejects(load('allele', '1); DROP TABLE gene.allele'), /Invalid/)
  await assert.rejects(load('__proto__', 1), /Invalid/)
  const ctx = { pgClient: client }
  await Promise.all([loadFacts(ctx, 'allele', 1), loadFacts(ctx, 'allele', 1)])
  assert.strictEqual(calls.length, 5)
  await loadFacts({ pgClient: client }, 'allele', 1)
  assert.strictEqual(calls.length, 6)
  const failed = createLoader({
    query: async () => {
      throw new Error('db unavailable')
    },
  })
  await Promise.all([
    assert.rejects(failed('allele', 1), /db unavailable/),
    assert.rejects(failed('allele', 2), /db unavailable/),
  ])
  await assert.rejects(
    createLoader({ query: async () => ({ rows: [] }) })('allele', 1),
    /Incomplete/
  )
  console.log(
    'Tool summaries: ' +
      cases +
      ' legacy parity cases; batching, isolation and failures passed'
  )
}
main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
