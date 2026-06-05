'use strict';

// Express middlewares for the GraphQL HTTP layer (Phase 2):
//   (A) fiveXXLogger  — log any response that finishes with status >= 500
//   (B) emptyBodyGuard — cleanly 400 the empty/bad-content-type POSTs that Apollo
//                        standalone 500s on ("POST body missing...")
// CJS so it's unit-testable directly under Node 10; esbuild bundles it from the ESM
// server/index.js. __dirname resolves to dist/ in the bundle, so ../logs = graphql/logs.

const fs = require('fs');
const path = require('path');
const { buildHttpErrorLine } = require('./logLine');

const LOG_DIR = process.env.GRAPHQL_ERROR_LOG_DIR || path.join(__dirname, '..', 'logs');
const INSTANCE = process.env.NODE_APP_INSTANCE || process.env.pm_id || String(process.pid);
const LOG_FILE = path.join(LOG_DIR, 'graphql-errors-' + INSTANCE + '.log');
try { fs.mkdirSync(LOG_DIR, { recursive: true }); } catch (_) {}

function clientIp(req) {
  const xff = req.headers && req.headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return (req.connection && req.connection.remoteAddress) ||
         (req.socket && req.socket.remoteAddress) || '';
}

function write(parts) {
  try { fs.appendFileSync(LOG_FILE, buildHttpErrorLine(parts)); } catch (_) {}
}

// (A) Log any response that finishes with status >= 500 (catches residual 500s the
// 400 guard doesn't cover, e.g. empty chunked bodies or genuine internal errors).
const fiveXXLogger = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 500) {
      write({
        ts: new Date().toISOString(), kind: 'http5xx', method: req.method, path: req.path,
        status: res.statusCode, ct: req.headers['content-type'], len: req.headers['content-length'],
        ip: clientIp(req), ua: req.headers['user-agent'],
      });
    }
  });
  next();
};

// (B) Cleanly 400 the empty/bad-content-type POSTs that Apollo standalone returns 500 for.
// Reject ONLY when content-length is explicitly "0" (so chunked JSON with no length still
// passes through) OR content-type is neither application/json nor application/graphql.
// Verified no Upload-scalar / multipart traffic exists, so multipart rejection is safe.
const emptyBodyGuard = (req, res, next) => {
  if (req.method === 'POST') {
    const ct = (req.headers['content-type'] || '').toLowerCase();
    const len = req.headers['content-length'];
    const okType = ct.indexOf('application/json') !== -1 || ct.indexOf('application/graphql') !== -1;
    if (!okType || len === '0') {
      write({
        ts: new Date().toISOString(), kind: 'rejected400', method: req.method, path: req.path,
        status: 400, ct: req.headers['content-type'], len: len, ip: clientIp(req),
        ua: req.headers['user-agent'],
      });
      res.status(400).json({
        errors: [{ message: 'Bad Request: POST to the GraphQL endpoint requires Content-Type ' +
          'application/json (or application/graphql) with a non-empty body.' }],
      });
      return;
    }
  }
  next();
};

module.exports = { fiveXXLogger, emptyBodyGuard };
