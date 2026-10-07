const { stripIgnoredCharacters } = require('graphql');
const { EventEmitter } = require('events');

// Per-worker, release/process-local serialized LRU. No disk or cross-release cache.
function createGeneGroupDelivery(documents, options = {}) {
  const maxBytes = options.maxBytes || 64 * 1024 * 1024;
  const ttl = options.ttl || 300000;
  const now = options.now || Date.now;
  const approved = new Set(documents.filter(s => /query GeneGroupTables\(/.test(s)).map(stripIgnoredCharacters));
  const cache = new Map(), pending = new Map(); let bytes = 0;
  function remove(key) { const old = cache.get(key); if (old) bytes -= old.body.length; cache.delete(key); }
  function put(key, body) {
    // Large groups may exceed half the cache budget (ENZYMES is ~38 MB).
    // Admit any response that fits; the LRU below still caps TOTAL bytes.
    if (body.length > maxBytes) return;
    remove(key);
    while (cache.size && (bytes + body.length > maxBytes || cache.size >= 32)) remove(cache.keys().next().value);
    cache.set(key, {body, expires: now() + ttl}); bytes += body.length;
  }
  function send(res, result) {
    if (res.destroyed || res.finished) return;
    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(result.body);
  }
  return function geneGroupDelivery(req, res, next) {
    const b = req.body || {};
    if (typeof b.query !== 'string' || typeof (b.variables || {}).FBgg !== 'string' || !/^FBgg[0-9]{7}$/.test((b.variables || {}).FBgg || '') ||
        (b.operationName != null && b.operationName !== 'GeneGroupTables')) return next();
    let doc; try { doc = stripIgnoredCharacters(b.query); } catch (_) { return next(); }
    if (!approved.has(doc)) return next();
    const key = doc + '\n' + b.variables.FBgg;
    const hit = cache.get(key);
    if (hit && hit.expires > now()) {
      cache.delete(key); cache.set(key, hit);
      res.setHeader('X-FlyBase-Group-Cache', 'HIT');
      return send(res, {status: 200, body: hit.body});
    }
    if (hit) remove(key);
    let work = pending.get(key);
    if (work && !work.aborted && work.clients.size < 16) {
      work.clients.add(res);
      res.once('close', () => { res.emit('graphql_delivery_finished'); work.clients.delete(res); if (!work.done && !work.clients.size) { work.aborted = true; work.emit('abort'); } });
      res.setHeader('X-FlyBase-Group-Cache', 'COALESCED');
      return;
    }
    // Bound in-flight cache bookkeeping; ordinary Apollo still handles overflow.
    if (pending.size >= 8 || work) return next();
    work = new EventEmitter(); work.clients = new Set([res]); work.aborted = false; work.done = false;
    pending.set(key, work); req.geneGroupWork = work;
    res.setHeader('X-FlyBase-Group-Cache', 'MISS');
    res.once('close', () => {
      work.clients.delete(res);
      if (!work.done && !work.clients.size) { work.aborted = true; work.emit('abort'); }
    });
    const end = res.end;
    res.end = function (chunk, encoding, callback) {
      if (!work.done) {
        work.done = true; clearTimeout(work.timer); pending.delete(key);
        const body = Buffer.isBuffer(chunk) ? chunk : Buffer.from(typeof chunk === 'string' ? chunk : '', typeof encoding === 'string' ? encoding : 'utf8');
        const result = {status: res.statusCode, body};
        if (!work.aborted && result.status === 200) {
          try { const parsed = JSON.parse(body.toString()); if (parsed.data && !parsed.errors) put(key, body); } catch (_) {}
        }
        for (const client of work.clients) if (client !== res) send(client, result);
        work.clients.clear();
      }
      return end.apply(this, arguments);
    };
    work.timer = setTimeout(() => {
      if (work.done) return;
      work.aborted = true; work.emit('abort'); work.done = true; pending.delete(key);
      const result = {status: 503, body: Buffer.from('{"errors":[{"message":"Gene group request timed out."}]}')};
      for (const client of work.clients) send(client, result);
      work.clients.clear();
    }, options.timeout || 30000);
    work.timer.unref();
    next();
  };
}

// Hold this request's checked-out connection until cancellation has completed,
// so a late cancel cannot hit a subsequent borrower of the same backend PID.
function withGeneGroupCancellation(plugin, pool) {
  return { requestDidStart(ctx) {
    const hooks = plugin.requestDidStart(ctx); let work, cancelPromise, abort, finished = false;
    return Object.assign({}, hooks, {
      async didResolveOperation(rc) {
        await hooks.didResolveOperation(rc);
        work = rc.context.geneGroupWork;
        const client = rc.context.pgClient;
        if (!work || !client) return;
        abort = () => {
          if (finished || cancelPromise) return;
          cancelPromise = pool.query('select pg_cancel_backend($1)', [client.processID]).catch(() => {});
        };
        work.on('abort', abort);
        if (work.aborted) { abort(); throw new Error('Gene group request disconnected.'); }
      },
      async willSendResponse(rc) {
        finished = true;
        if (work && abort) work.removeListener('abort', abort);
        if (cancelPromise) await cancelPromise;
        return hooks.willSendResponse(rc);
      }
    });
  }};
}
module.exports = { createGeneGroupDelivery, withGeneGroupCancellation };
