'use strict';
const assert = require('assert');
const EventEmitter = require('events');
const { createRequestDiagnostics } = require('./requestDiagnostics');
const doc = 'query Test($fbgn: String!) { gene(id: $fbgn) { id } }';
let time = 1000, usage = 0, rows = [], timers = [];
const observe = createRequestDiagnostics([doc], {enabled:true, pid:7, now:()=>time,
 cpu:()=>({user:usage,system:0}), memory:()=>({rss:100,heapUsed:50}),
 write:s=>{rows.push(JSON.parse(s));return true;}, later:fn=>{timers.push(fn);return fn;},cancel:()=>{}});
function response(){const r=new EventEmitter();r.statusCode=200;r.end=function(){return 'ended';};return r;}
const r=response();observe({body:{variables:{fbgn:'FBgn0000490',secret:'never-log',fbhh:'bad\n'}}},r,doc);
assert.equal(rows[0].phase,'start');assert.deepEqual(rows[0].ids,{fbgn:'FBgn0000490'});
time=3500;usage=900000;timers[0]();r.emit('close');assert.equal(rows[2].phase,'client_closed');
time=5000;usage=1500000;assert.equal(r.end(),'ended');r.emit('finish');
assert.equal(rows.length,4);assert.equal(rows[3].elapsed_ms,4000);assert.equal(rows[3].worker_cpu_interval_ms,1500);assert.equal(rows[3].client_closed,true);assert.equal(rows[3].phase,'server_end');
assert(!JSON.stringify(rows).includes('never-log'));assert(!JSON.stringify(rows).includes(doc));
const before=rows.length;observe({body:{}},response(),'unapproved');assert.equal(rows.length,before);
const disabled=createRequestDiagnostics([doc],{enabled:false,write:()=>{throw Error('must not log');}});disabled({},response(),doc);
const normal=response();observe({body:{}},normal,doc);normal.emit('finish');normal.emit('close');normal.end();assert.equal(rows[rows.length-1].phase,'finish');
const expiry=response();observe({body:{}},expiry,doc);timers[timers.length-1]();assert.equal(rows[rows.length-1].phase,'watch_expired');expiry.end();
// A logging failure must not prevent forwarding or change end()'s result.
const broken=createRequestDiagnostics([doc],{enabled:true,write:()=>{throw Error('sink failed');}});const safe=response();broken({body:{}},safe,doc);assert.equal(safe.end(),'ended');
// Bound event emission during bursts and make dropped-event count visible.
rows=[];time=6000;for(let i=0;i<150;i++){const x=response();observe({body:{}},x,doc);x.end();}
assert.equal(rows.length,100);time=8000;const last=response();observe({body:{}},last,doc);last.end();assert(rows[100].dropped_events_before>=200);
console.log('PASS diagnostics lifecycle, post-disconnect completion, privacy, failures, expiry and rate bound');

const { boundedWriter } = require('./requestDiagnostics');
const sink = new EventEmitter(); let writes = 0;
sink.write = () => { writes++; return false; };
const writer = boundedWriter(sink);assert.equal(writer('one'),true);
for(let i=0;i<1000;i++)assert.equal(writer('dropped'),false);
assert.equal(writes,1);assert.equal(sink.listenerCount('drain'),1);
sink.emit('drain');assert.equal(writer('next'),true);assert.equal(writes,2);
console.log('PASS Node10-compatible stalled sink backpressure');
