'use strict';
const crypto = require('crypto');
// Node 10-compatible backpressure: stop writing until the sink drains.
function boundedWriter(stream) {
  let blocked = false;
  return function (line) {
    if (blocked) return false;
    if (!stream.write(line)) {
      blocked = true;
      stream.once('drain', () => { blocked = false; });
    }
    return true; // write(false) still accepted this line into the bounded buffer.
  };
}
// CPU/RSS are worker-wide interval observations, NOT per-request attribution.
// Only metadata from approved documents and syntactically valid public IDs logs.
function createRequestDiagnostics(documents, options = {}) {
  const enabled = options.enabled === undefined ? process.env.GRAPHQL_REQUEST_DIAGNOSTICS === '1' : options.enabled;
  if (!enabled) return function () {};
  const write = options.write || boundedWriter(process.stderr);
  const now = options.now || (() => Date.now());
  const cpu = options.cpu || (() => process.cpuUsage());
  const memory = options.memory || (() => process.memoryUsage());
  const later = options.later || setTimeout;
  const cancel = options.cancel || clearTimeout;
  const pid = options.pid || process.pid;
  const metadata = new Map(documents.map(query => [query, {
    operation: (query.match(/\bquery\s+(\w+)/) || [])[1] || 'anonymous',
    document_sha256: crypto.createHash('sha256').update(query).digest('hex'),
  }]));
  let sequence = 0, active = 0, windowStart = now(), emitted = 0, dropped = 0;
  function log(fields) {
    try {
      const time = now();
      if (time - windowStart >= 1000) { windowStart = time; emitted = 0; }
      if (emitted >= 100) { dropped++; return; }
      emitted++;
      const record = Object.assign({event: 'graphql_request', timestamp: new Date(time).toISOString(), pid,
        dropped_events_before: dropped}, fields);
      // Dropped records are counted; no retries or application-side queue.
      if (write(JSON.stringify(record) + '\n') === false) dropped++;
      else dropped = 0;
    } catch (_) { dropped++; }
  }
  return function observe(req, res, approvedQuery) {
    try {
      const meta = metadata.get(approvedQuery);
      if (!meta) return;
      const id = pid + '-' + (++sequence);
      const started = now(), initialCpu = cpu(), initialMemory = memory();
      const ids = {};
      for (const key of ['geneId', 'fbgn', 'fbhh', 'FBgg']) {
        const value = req.body && req.body.variables && req.body.variables[key];
        if (typeof value === 'string' && value.length === 11 && /^FB(?:gn|hh|gg)[0-9]{7}$/.test(value)) ids[key] = value;
      }
      active++;
      const base = Object.assign({request_id: id, ids}, meta);
      let done = false, clientClosed = false;
      function fields(phase) {
        const currentCpu = cpu(), currentMemory = memory();
        return Object.assign({}, base, {phase, elapsed_ms: Math.max(0, now() - started),
          worker_cpu_interval_ms: (currentCpu.user + currentCpu.system - initialCpu.user - initialCpu.system) / 1000,
          worker_rss_bytes: currentMemory.rss, worker_heap_used_bytes: currentMemory.heapUsed,
          worker_rss_delta_bytes: currentMemory.rss - initialMemory.rss, worker_active_requests: active, client_closed: clientClosed});
      }
      log(Object.assign({}, base, {phase: 'start', worker_active_requests: active}));
      const timer = later(() => {
        try { if (!done) log(fields('slow_inflight')); } catch (_) {}
      }, 2000);
      if (timer && timer.unref) timer.unref();
      const expiry = later(() => finish('watch_expired'), 120000);
      if (expiry && expiry.unref) expiry.unref();
      function finish(phase) {
        if (done) return;
        done = true; cancel(timer); cancel(expiry);
        try { log(Object.assign(fields(phase), {http_status: res.statusCode})); }
        catch (_) {} finally { active--; }
      }
      // end() is called when Apollo finishes even if the client already left;
      // a close event alone must not hide continued server-side work.
      const originalEnd = res.end;
      res.end = function () {
        try { return originalEnd.apply(this, arguments); }
        finally { finish('server_end'); }
      };
      res.once('finish', () => finish('finish'));
      // A coalesced follower owns no backend work after it disconnects.
      res.once('graphql_delivery_finished', () => finish('coalesced_finished'));
      res.once('close', () => {
        if (done) return;
        clientClosed = true;
        try { log(fields('client_closed')); } catch (_) {}
      });
    } catch (_) { /* Observability must not change request handling. */ }
  };
}
module.exports = { createRequestDiagnostics, boundedWriter };
