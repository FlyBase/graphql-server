'use strict';
const assert = require('assert');
const { parse, print, getOperationAST } = require('graphql');
const { createGal4OperationBoundary, gal4HttpBoundary, gal4BodyBoundary, gal4JsonErrorBoundary } = require('./index');
const documents = require('./approved-documents.json');
let checks = 0;
function check(name, action) { action(); checks++; process.stdout.write('PASS ' + name + '\n'); }
check('empty allowlist fails closed', () => assert.throws(() => createGal4OperationBoundary([])));
check('mutation cannot be approved', () => assert.throws(() => createGal4OperationBoundary(['mutation M { __typename }'])));
const plugin = createGal4OperationBoundary(documents);
function validate(source) {
  const document = parse(source);
  return plugin.requestDidStart().didResolveOperation({ document, operation: getOperationAST(document) });
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
check('mutation rejected', () => assert.throws(() => validate('mutation Change { __typename }')));
function run(middleware, req, error) {
  const response = { headers: {}, status(n) { this.code=n; return this; }, set(k,v) { this.headers[k]=v; return this; }, type(t) { this.contentType=t; return this; }, send(body) { this.body=body; return this; } };
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
process.stdout.write(JSON.stringify({checks,documents:documents.length,pass:true}) + '\n');
