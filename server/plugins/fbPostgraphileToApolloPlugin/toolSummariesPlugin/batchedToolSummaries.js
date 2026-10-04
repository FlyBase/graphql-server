'use strict'
// Read the same public gene views used by PostGraphile. Values are always bound;
// table/column identifiers below are fixed, never derived from a request.
const BATCH_SIZE = 100
const requests = new WeakMap()
const uses = (condition) =>
  `(SELECT COALESCE(json_agg(json_build_object('id',u.fbcv_id,'name',u.name) ORDER BY u.id),'[]'::json) FROM gene.tool_use u WHERE ${condition})`
const tools = (condition) =>
  `(SELECT COALESCE(json_agg(json_build_object('id',t.fbid,'symbol',t.symbol,'relType',t.rel_type,'uses',${uses(
    'u.tool_id=t.id'
  )}) ORDER BY t.id),'[]'::json) FROM gene.tool t WHERE ${condition})`
const constructs = (condition) =>
  `(SELECT COALESCE(json_agg(json_build_object('tools',${tools(
    't.construct_id=c.id'
  )},'toolUses',${uses(
    'u.construct_id=c.id'
  )}) ORDER BY c.id),'[]'::json) FROM gene.construct c WHERE ${condition})`
const ALLELE_SQL = `SELECT p.id::text AS id, json_build_object(
 'tools',${tools('t.allele_id=p.id')},
 'toolUses',${uses('u.allele_id=p.id')},
 'insertions',(SELECT COALESCE(json_agg(json_build_object('constructs',${constructs(
   'c.insertion_id=i.id'
 )}) ORDER BY i.id),'[]'::json) FROM gene.insertion i WHERE i.allele_id=p.id),
 'constructs',${constructs('c.allele_id=p.id')},
 'gene',(SELECT json_build_object('id',g.uniquename,'symbol',g.name) FROM gene.allele a JOIN gene.gene g ON g.feature_id=a.gene_id WHERE a.id=p.id)
 ) AS facts FROM unnest($1::bigint[]) AS p(id)`
const INSERTION_SQL = `SELECT p.id::text AS id, json_build_object('constructs',${constructs(
  'c.insertion_id=p.id'
)}) AS facts FROM unnest($1::bigint[]) AS p(id)`
function createLoader(pgClient) {
  const caches = { allele: new Map(), insertion: new Map() }
  const pending = { allele: [], insertion: [] }
  let scheduled = false
  async function flush() {
    scheduled = false
    const batches = {
      allele: pending.allele.splice(0),
      insertion: pending.insertion.splice(0),
    }
    for (const type of ['allele', 'insertion']) {
      const queue = batches[type]
      for (let offset = 0; offset < queue.length; offset += BATCH_SIZE) {
        const chunk = queue.slice(offset, offset + BATCH_SIZE)
        try {
          const result = await pgClient.query(
            type === 'allele' ? ALLELE_SQL : INSERTION_SQL,
            [chunk.map((x) => x.id)]
          )
          const rows = new Map(result.rows.map((r) => [String(r.id), r.facts]))
          // Missing rows indicate an execution/contract failure, not empty science.
          if (chunk.some((x) => !rows.has(x.id)))
            throw new Error('Incomplete tool-summary batch')
          for (const item of chunk) item.resolve(rows.get(item.id))
        } catch (error) {
          for (const item of chunk) item.reject(error)
        }
      }
    }
  }
  return function load(type, id) {
    if (
      !Object.prototype.hasOwnProperty.call(caches, type) ||
      !/^[0-9]+$/.test(String(id))
    ) {
      return Promise.reject(new Error('Invalid tool-summary parent'))
    }
    const key = String(id),
      cache = caches[type]
    if (cache.has(key)) return cache.get(key)
    const promise = new Promise((resolve, reject) =>
      pending[type].push({ id: key, resolve, reject })
    )
    cache.set(key, promise)
    if (!scheduled) {
      scheduled = true
      setImmediate(flush)
    }
    return promise
  }
}
function loadFacts(context, type, id) {
  let load = requests.get(context)
  if (!load) {
    if (!context.pgClient)
      throw new Error('Missing tool-summary database context')
    load = createLoader(context.pgClient)
    requests.set(context, load)
  }
  return load(type, id)
}
const relations = {
  regRegions: 'has_reg_region',
  alsoCarries: 'carries_tool',
  taggedWith: 'tagged_with',
  tagUses: 'tagged_with',
  encodedTools: 'encodes_tool',
  encodedToolUses: 'encodes_tool',
}
function summarize(facts, type, field, propagate, isConstruct) {
  const branches = []
  if (type === 'allele') branches.push(facts)
  if (propagate) {
    // Preserve original root order: direct, insertion->construct, construct.
    for (const insertion of type === 'allele' ? facts.insertions || [] : [])
      branches.push(...insertion.constructs)
    branches.push(...(facts.constructs || []))
  }
  let result = []
  if (field === 'insertedElementTypes') {
    for (const b of branches) result.push(...b.toolUses)
  } else {
    const relation = relations[field]
    if (!relation) throw new Error('Unknown tool-summary field')
    const wantUses = field === 'tagUses' || field === 'encodedToolUses'
    for (const b of branches)
      for (const tool of b.tools) {
        if (tool.relType !== relation) continue
        if (wantUses) result.push(...tool.uses)
        else result.push({ id: tool.id, symbol: tool.symbol })
      }
  }
  if (
    field === 'encodedTools' &&
    result.length === 0 &&
    type === 'allele' &&
    isConstruct
  )
    result = [facts.gene]
  return result
}
module.exports = {
  loadFacts,
  summarize,
  createLoader,
  ALLELE_SQL,
  INSERTION_SQL,
  BATCH_SIZE,
}
