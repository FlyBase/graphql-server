'use strict';
// Redirect the middleware's log dir to /tmp BEFORE requiring it — its module-load
// mkdirSync + the guard's appendFileSync would otherwise create a logs/ dir in the repo
// (in production __dirname is dist/, so this env var is only needed for the unit test).
process.env.GRAPHQL_ERROR_LOG_DIR = '/tmp/gqltest-logs';
const assert = require('assert');
const {
  truncate, buildErrorRecord, buildErrorLogLine,
} = require('./logLine');

let n = 0;
function test(name, fn) { fn(); n++; console.log('ok - ' + name); }

test('truncate leaves short strings unchanged', () => {
  assert.strictEqual(truncate('abc', 10), 'abc');
});

test('truncate cuts long strings and marks them', () => {
  assert.strictEqual(truncate('x'.repeat(50), 10), 'xxxxxxxxxx…[truncated]');
});

test('buildErrorRecord captures op, message, path, code, variables', () => {
  const rec = buildErrorRecord({
    ts: '2026-06-04T00:00:00.000Z',
    operationName: 'GeneReport',
    query: '{ gene { id } }',
    variables: { id: 'FBgn0000490' },
    errors: [{ message: 'boom', path: ['gene', 'id'], extensions: { code: 'INTERNAL_SERVER_ERROR' } }],
  });
  assert.strictEqual(rec.op, 'GeneReport');
  assert.strictEqual(rec.errCount, 1);
  assert.strictEqual(rec.errors[0].message, 'boom');
  assert.deepStrictEqual(rec.errors[0].path, ['gene', 'id']);
  assert.strictEqual(rec.errors[0].code, 'INTERNAL_SERVER_ERROR');
  assert.strictEqual(rec.variables, '{"id":"FBgn0000490"}');
});

test('buildErrorLogLine emits exactly one valid-JSON line', () => {
  const line = buildErrorLogLine({
    ts: '2026-06-04T00:00:00.000Z', operationName: 'X', query: 'q',
    variables: {}, errors: [{ message: 'e' }],
  });
  assert.strictEqual(line.endsWith('\n'), true);
  assert.strictEqual(line.trim().split('\n').length, 1);
  JSON.parse(line);
});

test('null operationName becomes null', () => {
  assert.strictEqual(buildErrorRecord({ ts: 't', errors: [] }).op, null);
});

test('long query truncated', () => {
  const rec = buildErrorRecord({ ts: 't', query: 'q'.repeat(5000), errors: [] });
  assert.ok(rec.query.length < 2100 && rec.query.endsWith('…[truncated]'));
});

test('unserializable variables do not throw', () => {
  const circular = {}; circular.self = circular;
  const rec = buildErrorRecord({ ts: 't', variables: circular, errors: [] });
  assert.strictEqual(rec.variables, '[unserializable]');
});

test('long error message is truncated to MAX_MSG', () => {
  const rec = buildErrorRecord({ ts: 't', errors: [{ message: 'm'.repeat(5000) }] });
  assert.ok(rec.errors[0].message.length < 1100);
  assert.ok(rec.errors[0].message.endsWith('…[truncated]'));
});

test('errors array capped at MAX_ERRORS but errCount keeps the true total', () => {
  const many = Array.from({ length: 25 }, (_, i) => ({ message: 'e' + i }));
  const rec = buildErrorRecord({ ts: 't', errors: many });
  assert.strictEqual(rec.errCount, 25);
  assert.strictEqual(rec.errors.length, 10);
});

// --- HTTP-error record builder (Phase 2) ---
const { buildHttpErrorRecord, buildHttpErrorLine } = require('./logLine');

test('buildHttpErrorRecord captures method/status/ct/ip and truncates UA', () => {
  const rec = buildHttpErrorRecord({ ts: 't', kind: 'http5xx', method: 'POST', path: '/',
    status: 500, ct: 'application/json', len: '0', ip: '1.2.3.4', ua: 'x'.repeat(500) });
  assert.strictEqual(rec.kind, 'http5xx');
  assert.strictEqual(rec.status, 500);
  assert.strictEqual(rec.method, 'POST');
  assert.strictEqual(rec.ip, '1.2.3.4');
  assert.ok(rec.ua.length < 320 && rec.ua.endsWith('…[truncated]'));
});

test('buildHttpErrorLine is one valid-JSON line', () => {
  const line = buildHttpErrorLine({ ts: 't', kind: 'rejected400', method: 'POST', path: '/',
    status: 400, ct: 'text/plain', len: '5', ip: '9.9.9.9', ua: 'UA' });
  assert.strictEqual(line.endsWith('\n'), true);
  assert.strictEqual(line.trim().split('\n').length, 1);
  JSON.parse(line);
});

// --- emptyBodyGuard decision logic (Phase 2) ---
const { emptyBodyGuard } = require('./httpErrorMiddleware');
function mockRes() { return { _status: 200, _json: null, status(c){this._status=c;return this;}, json(o){this._json=o;return this;} }; }
function runGuard(method, headers) {
  const req = { method, path: '/', headers, connection: {} };
  const res = mockRes(); let nexted = false;
  emptyBodyGuard(req, res, () => { nexted = true; });
  return { nexted, status: res._status };
}
test('guard passes legit application/json POST with body', () => {
  const r = runGuard('POST', { 'content-type': 'application/json', 'content-length': '42' });
  assert.strictEqual(r.nexted, true);
});
test('guard 400s empty-length POST', () => {
  const r = runGuard('POST', { 'content-type': 'application/json', 'content-length': '0' });
  assert.strictEqual(r.nexted, false); assert.strictEqual(r.status, 400);
});
test('guard 400s text/plain POST', () => {
  const r = runGuard('POST', { 'content-type': 'text/plain', 'content-length': '5' });
  assert.strictEqual(r.nexted, false); assert.strictEqual(r.status, 400);
});
test('guard passes GET untouched', () => {
  const r = runGuard('GET', {});
  assert.strictEqual(r.nexted, true);
});
test('guard passes chunked json POST (no content-length)', () => {
  const r = runGuard('POST', { 'content-type': 'application/json' });
  assert.strictEqual(r.nexted, true);
});

console.log('\n' + n + ' tests passed');
