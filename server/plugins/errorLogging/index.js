import fs from 'fs';
import path from 'path';
import { buildErrorLogLine } from './logLine';

// dist/bundle.js runs from <graphql>/dist; logs live at <graphql>/logs.
const LOG_DIR = process.env.GRAPHQL_ERROR_LOG_DIR || path.join(__dirname, '..', 'logs');
// PM2 sets NODE_APP_INSTANCE per cluster worker (0..N-1) -> one stable file per worker.
const INSTANCE = process.env.NODE_APP_INSTANCE || process.env.pm_id || String(process.pid);
const LOG_FILE = path.join(LOG_DIR, 'graphql-errors-' + INSTANCE + '.log');

// Ensure the log dir exists (a fresh EBS volume may not have graphql/logs yet).
// Best-effort: if this fails, appendFileSync below is wrapped in try/catch.
try { fs.mkdirSync(LOG_DIR, { recursive: true }); } catch (_) {}

// Apollo Server 2.x plugin: didEncounterErrors fires for any request that produced
// one or more errors. Log every such request as a single JSON line.
const ErrorLoggingPlugin = {
  requestDidStart() {
    return {
      didEncounterErrors(requestContext) {
        try {
          const req = requestContext.request || {};
          const line = buildErrorLogLine({
            ts: new Date().toISOString(),
            operationName: req.operationName,
            query: req.query,
            variables: req.variables,
            errors: requestContext.errors,
          });
          fs.appendFileSync(LOG_FILE, line); // sync: serializes same-worker writes, no interleave even for big lines
        } catch (_) {
          // logging must never break a request
        }
      },
    };
  },
};

export default ErrorLoggingPlugin;
