'use strict';

// Pure, dependency-free helpers for one-line JSON error records.
// CommonJS so it is unit-testable directly under the project's Node 10 (no build,
// no test framework). esbuild bundles it correctly when imported from the ESM plugin.

const MAX_QUERY = 2000;
const MAX_VARS = 1000;
const MAX_MSG = 1000;   // per-error message cap
const MAX_ERRORS = 10;  // keep at most this many error objects (errCount keeps the true total)

function truncate(str, max) {
  if (typeof str !== 'string') return str;
  return str.length > max ? str.slice(0, max) + '…[truncated]' : str;
}

function buildErrorRecord({ ts, operationName, query, variables, errors }) {
  const all = errors || [];
  const errs = all.slice(0, MAX_ERRORS).map((e) => ({
    message: truncate(e && e.message ? String(e.message) : String(e), MAX_MSG),
    path: e && e.path ? e.path : undefined,
    code: e && e.extensions && e.extensions.code ? e.extensions.code : undefined,
  }));
  let vars;
  try {
    vars = variables === undefined ? undefined : JSON.stringify(variables);
  } catch (_) {
    vars = '[unserializable]';
  }
  return {
    ts: ts,
    op: operationName || null,
    errCount: all.length,   // TRUE total even though `errors` is capped at MAX_ERRORS
    errors: errs,
    query: truncate(query || '', MAX_QUERY),
    variables: vars === undefined ? undefined : truncate(vars, MAX_VARS),
  };
}

function buildErrorLogLine(parts) {
  return JSON.stringify(buildErrorRecord(parts)) + '\n';
}

const MAX_UA = 300;

// HTTP-layer error record (for the 5xx logger + the 400 guard) — distinct from the
// GraphQL-execution record above; `kind` distinguishes them in the same log file.
function buildHttpErrorRecord({ ts, kind, method, path, status, ct, len, ip, ua }) {
  return {
    ts: ts,
    kind: kind || 'http',
    method: method || null,
    path: path || null,
    status: status == null ? null : status,
    ct: ct || null,
    len: len || null,
    ip: ip || null,
    ua: truncate(ua || '', MAX_UA),
  };
}

function buildHttpErrorLine(parts) {
  return JSON.stringify(buildHttpErrorRecord(parts)) + '\n';
}

module.exports = {
  truncate, buildErrorRecord, buildErrorLogLine,
  buildHttpErrorRecord, buildHttpErrorLine,
  MAX_QUERY, MAX_VARS, MAX_MSG, MAX_ERRORS, MAX_UA,
};
