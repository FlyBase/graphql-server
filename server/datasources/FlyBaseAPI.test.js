const assert = require('assert')
const fs = require('fs')
const http = require('http')
const vm = require('vm')
const { InMemoryLRUCache } = require('apollo-server-caching')

// Load the ES module with the real RESTDataSource under the supported Node 10 runtime.
const source = fs.readFileSync(__dirname + '/FlyBaseAPI.js', 'utf8')
  .replace("import { RESTDataSource } from 'apollo-datasource-rest'",
    "const { RESTDataSource } = require('apollo-datasource-rest')")
  .replace('export default FlyBaseAPI', 'module.exports = FlyBaseAPI')
function datasource(env) {
  const sandbox = { require, module: { exports: {} }, process: { env } }
  vm.runInNewContext(source, sandbox)
  return new sandbox.module.exports()
}

async function main() {
  assert.strictEqual(datasource({}).baseURL, 'http://localhost:7082/api/')
  assert.strictEqual(datasource({ FLYBASE_API_BASE_URL: 'http://flybase-prod:7082/api/' }).baseURL,
    'http://flybase-prod:7082/api/')
  const requests = []
  const server = http.createServer((req, res) => {
    requests.push(req.url)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ resultset: { result: [{ id: 'FBal0041036' }] } }))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const api = datasource({ FLYBASE_API_BASE_URL: `http://127.0.0.1:${server.address().port}/api/` })
    api.initialize({ context: {}, cache: new InMemoryLRUCache() })
    const result = await api.searchExpressionToolsByGene({ gene: 'ct' })
    assert.strictEqual(result.resultset.result[0].id, 'FBal0041036')
    await api.searchExpressionToolsByExpression({ expression: { anatomy: 'wing disc' } })
    assert.strictEqual(requests[0], '/api/expression/tools?gene=ct')
    assert.strictEqual(requests[1], '/api/expression/tools?anatomy=wing+disc')
    console.log('PASS local default, Docker override, and both real REST request paths')
  } finally {
    await new Promise(resolve => server.close(resolve))
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
