'use strict';
const assert = require('assert');
const { parse, print, getOperationAST } = require('graphql');
const { createGal4OperationBoundary, createGal4DocumentBoundary, gal4HttpBoundary, gal4BodyBoundary, gal4JsonErrorBoundary, MAX_QUERY_LENGTH } = require('./index');
const documents = require('./approved-documents.json');
let checks = 0;
function check(name, action) { action(); checks++; process.stdout.write('PASS ' + name + '\n'); }
check('empty allowlist fails closed', () => assert.throws(() => createGal4OperationBoundary([])));
check('mutation cannot be approved', () => assert.throws(() => createGal4OperationBoundary(['mutation M { __typename }'])));
const plugin = createGal4OperationBoundary(documents);
function validate(source, variables = {geneId: 'FBgn0024250', fbgn: 'FBgn0024250'}) {
  const document = parse(source);
  return plugin.requestDidStart().didResolveOperation({ document, operation: getOperationAST(document), request: {variables} });
}
documents.forEach((source, i) => {
  check('actual bundled wire document ' + i, () => validate(source));
  check('normalized whitespace/comment equivalent ' + i, () => validate('# comment\n' + print(parse(source))));
});
check('unapproved introspection rejected', () => assert.throws(() => validate('query SchemaCheck { __schema { queryType { name } } }')));
check('same operation name does not authorize selections', () => {
  const name = getOperationAST(parse(documents[0])).name.value;
  assert.throws(() => validate('query ' + name + ' { __typename }'));
});
check('extra operation rejected', () => assert.throws(() => validate(documents[0] + '\nquery Additional { __typename }')));
check('gene group member tables use the approved report document', () => {
  const source = documents.find(source => getOperationAST(parse(source)).name.value === 'GeneGroupTables');
  assert(source, 'Missing gene group report operation');
  validate(source);
  assert.throws(() => validate('query GeneGroupTables($FBgg: String!) { geneGroupv2(id: $FBgg) { id } }'));
  assert.throws(() => validate(source.replace('geneGroupv2(id: $FBgg)', 'other: geneGroupv2(id: $FBgg)')));
});
check('mutation rejected', () => assert.throws(() => validate('mutation Change { __typename }')));
['GeneToolKitMostCommonlyUsed', 'classicalAndInsertionAllelesByGene',
 'transgenicConstructAllelesByGene', 'insertionsWithoutAllelesByGene',
 'alleleDiseaseVariantsByFBgn'].forEach(name => {
  check('gene report requires a single ID: ' + name, () => {
    const source = documents.find(source => getOperationAST(parse(source)).name.value === name);
    assert(source, 'Missing gene report operation');
    validate(source);
    validate(source, {geneId: 'FBgn9999999', fbgn: 'FBgn9999999'});
    for (const id of [undefined, null, '', '*', 'FBal0024250', ['FBgn0024250']]) {
      assert.throws(() => validate(source, {geneId: id, fbgn: id}), /single FlyBase gene ID/);
    }
    assert.throws(() => validate('query ' + name + ' { __typename }'));
  });
});
function run(middleware, req, error) {
  const response = { headers: {}, status(n) { this.code=n; return this; }, set(k,v) { this.headers[k]=v; return this; }, type(t) { this.contentType=t; return this; }, send(body) { this.body=body; return this; }, json(body) { this.body=body; this.contentType='application/json'; return this; } };
  let next=false;
  if (error) middleware(error,req,response,() => {next=true;});
  else middleware(req,response,() => {next=true;});
  return { response, next };
}
check('canonical POST root passes', () => assert(run(gal4HttpBoundary,{method:'POST',url:'/'}).next));
['GET','HEAD','PUT','OPTIONS'].forEach(method => check('closed method ' + method, () => {
  const r=run(gal4HttpBoundary,{method,url:'/'}); assert.strictEqual(r.response.code,405);assert.strictEqual(r.response.headers.Allow,'POST');
}));
['/graphql','//','/extra','/?query=ordinary'].forEach(url => check('closed path ' + url, () => assert.strictEqual(run(gal4HttpBoundary,{method:'POST',url}).response.code,404)));
check('normal variables unchanged', () => {
  const body={query:documents[0],variables:{expression:{stage:'adult stage'},fbal_ids:['FBal0155540','FBal0155847']}};
  const before=JSON.stringify(body);assert(run(gal4BodyBoundary,{body}).next);assert.strictEqual(JSON.stringify(body),before);
});
[null,[],[{query:documents[0]}],{}, {query:42}, {extensions:{persistedQuery:{sha256Hash:'ordinary'}}}].forEach((body,i) => check('bad/batch/envelope ' + i, () => assert.strictEqual(run(gal4BodyBoundary,{body}).response.code,400)));
check('malformed JSON safe error', () => {
  const r=run(gal4JsonErrorBoundary,{}, {status:400,message:'ordinary input text'});
  assert.strictEqual(r.response.code,400);assert(!r.response.body.includes('ordinary input text'));
});
check('existing parser size status preserved', () => assert.strictEqual(run(gal4JsonErrorBoundary,{}, {status:413}).response.code,413));

// --- Pre-Apollo document boundary --------------------------------------------
// Apollo validates before didResolveOperation, and validation is where the
// 2026-09-18 heap aborts happened (getVariableUsages). Only approved documents
// may reach Apollo at all.
const docGate = createGal4DocumentBoundary(documents);
const gate = (query) => run(docGate, { body: { query } });
documents.forEach((source, i) => {
  check('pre-Apollo: approved wire document passes ' + i, () => assert(gate(source).next));
  check('pre-Apollo: normalized equivalent passes ' + i, () => assert(gate('# comment\n' + print(parse(source))).next));
});
check('pre-Apollo: unapproved document rejected before Apollo', () => {
  const r = gate('query SchemaCheck { __schema { queryType { name } } }');
  assert(!r.next); assert.strictEqual(r.response.code, 400);
  assert(/temporarily unavailable/.test(JSON.stringify(r.response.body)));
});
check('pre-Apollo: approved name with other selections rejected', () => {
  const name = getOperationAST(parse(documents[0])).name.value;
  assert(!gate('query ' + name + ' { __typename }').next);
});
check('pre-Apollo: oversized text rejected without parsing', () => {
  const r = gate('query Q { ' + 'a '.repeat(MAX_QUERY_LENGTH) + '}');
  assert(!r.next); assert.strictEqual(r.response.code, 400);
});
check('pre-Apollo: deep nesting within the cap is refused, not thrown', () => {
  const depth = Math.floor((MAX_QUERY_LENGTH - 20) / 3);
  const deep = 'query Q ' + '{a'.repeat(depth) + '}'.repeat(depth);
  assert(deep.length <= MAX_QUERY_LENGTH);
  const r = gate(deep); assert(!r.next); assert.strictEqual(r.response.code, 400);
});
check('pre-Apollo: many variable usages refused before validation', () => {
  // The shape that stresses getVariableUsages: one variable used many times.
  const uses = Array.from({ length: 300 }, (_, i) => 'f' + i + ': x(v: $v)').join(' ');
  const r = gate('query Q($v: String) { ' + uses + ' }');
  assert(!r.next); assert.strictEqual(r.response.code, 400);
});
// Refusing must stay cheap. print(parse()) took 5.4 s on the depth-2000 shape.
function cheapRefusal(name, query) {
  check('pre-Apollo: refused in linear time: ' + name, () => {
    assert(query.length <= MAX_QUERY_LENGTH, name + ' is ' + query.length + ' chars');
    const start = Date.now();
    for (let i = 0; i < 10; i++) assert(!gate(query).next);
    const ms = (Date.now() - start) / 10;
    assert(ms < 25, name + ' took ' + ms + ' ms per request');
  });
}
const nest = (open, close, unit) => {
  const n = Math.floor((MAX_QUERY_LENGTH - 20) / unit);
  return 'query Q ' + open.repeat(n) + close.repeat(n);
};
cheapRefusal('nested fields', nest('{a', '}', 3));
cheapRefusal('nested inline fragments', nest('{...{', '}}', 7));
cheapRefusal('nested list values', 'query Q { a(v: ' + '['.repeat(2000) + ']'.repeat(2000) + ') }');
cheapRefusal('nested object values', 'query Q { a(v: ' + '{a:'.repeat(1000) + '1' + '}'.repeat(1000) + ') }');
cheapRefusal('many-line block string', 'query Q { a(v: """' + '\n x'.repeat(1300) + '""") }');
cheapRefusal('many small tokens', 'query Q { ' + 'a '.repeat(2000) + '}');
check('pre-Apollo: malformed syntax rejected', () => assert.strictEqual(gate('query {').response.code, 400));
[undefined, null, 42, {}, ['x']].forEach((q, i) => check('pre-Apollo: non-string query rejected ' + i, () => assert(!gate(q).next)));
check('pre-Apollo: an approved document over the cap fails at startup', () =>
  assert.throws(() => createGal4DocumentBoundary(['query Q { ' + 'a '.repeat(MAX_QUERY_LENGTH) + '}'])));
check('pre-Apollo: empty allowlist fails closed', () => assert.throws(() => createGal4DocumentBoundary([])));
check('pre-Apollo: every approved document is within the cap', () =>
  documents.forEach((d) => assert(d.length <= MAX_QUERY_LENGTH, 'approved document is ' + d.length + ' chars')));
process.stdout.write(JSON.stringify({checks,documents:documents.length,pass:true}) + '\n');
