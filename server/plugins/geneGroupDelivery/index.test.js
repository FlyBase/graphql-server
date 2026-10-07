const assert = require('assert');
const {EventEmitter} = require('events');
const {createGeneGroupDelivery, withGeneGroupCancellation} = require('./index');
const doc='query GeneGroupTables($FBgg:String!){geneGroup(id:$FBgg){id}}';
const doc2='query GeneGroupTables($FBgg:String!){geneGroup(id:$FBgg){id name}}';
function response(){const r=new EventEmitter();r.statusCode=200;r.headers={};r.setHeader=(k,v)=>r.headers[k]=v;r.end=b=>{r.body=b;r.finished=true;r.emit('close');};return r;}
function request(m,id='FBgg0001106',query=doc,operationName){const req={body:{query,variables:{FBgg:id},operationName}},res=response();let next=0;m(req,res,()=>next++);return {req,res,next};}
(async()=>{
 let time=0;const m=createGeneGroupDelivery([doc,doc2],{now:()=>time,ttl:100,maxBytes:1000});
 const a=request(m),b=request(m);assert.equal(a.next,1);assert.equal(b.next,0);
 a.res.end('{"data":{"geneGroup":{"id":"a"}}}');assert.equal(String(a.res.body),String(b.res.body));
 const hit=request(m);assert.equal(hit.next,0);assert.equal(hit.res.headers['X-FlyBase-Group-Cache'],'HIT');
 const other=request(m,'FBgg0000745');assert.equal(other.next,1);other.res.end('{}');
 const variant=request(m,'FBgg0001106',doc2);assert.equal(variant.next,1);variant.res.end('{}');
 assert.equal(request(m,'FBgg0001106',doc,'Other').next,1);
 assert.equal(request(m,'*').next,1);
 assert.equal(request(m,['FBgg0001106']).next,1);
 assert.equal(request(m,{toString:()=> 'FBgg0001106'}).next,1);
 time=101;const expired=request(m);assert.equal(expired.next,1);expired.res.end('{"errors":[{"message":"no"}]}');
 const retry=request(m);assert.equal(retry.next,1);retry.res.end('{"data":{"x":1},"errors":[{}]}');
 const failed=request(m);assert.equal(failed.next,1);failed.res.statusCode=503;failed.res.end('{"data":{"x":1}}');
 const leader=request(m), follower=request(m);let aborts=0;leader.req.geneGroupWork.on('abort',()=>aborts++);
 leader.res.destroyed=true;leader.res.emit('close');assert.equal(aborts,0);
 follower.res.destroyed=true;follower.res.emit('close');assert.equal(aborts,1);leader.res.end('{}');
 const t=createGeneGroupDelivery([doc],{timeout:10});const timeout=request(t);await new Promise(r=>setTimeout(r,20));assert.equal(timeout.res.statusCode,503);assert.equal(timeout.req.geneGroupWork.aborted,true);
 const small=createGeneGroupDelivery([doc],{maxBytes:100});
 for(let i=1;i<=6;i++){const x=request(small,'FBgg000000'+i);x.res.end('{"data":{"id":"'+i+'"}}');}
 const eviction=request(small,'FBgg0000001');assert.equal(eviction.next,1);eviction.res.end('{}');
 // Byte-boundary regression: a valid response larger than half the budget
 // must be reusable, without allowing the total retained bytes to grow.
 const budget=128;
 const sized = n => Buffer.from(JSON.stringify({data:{text:"x".repeat(n-Buffer.byteLength(JSON.stringify({data:{text:""}})))}}));
 assert.equal(sized(budget).length,budget);
 const large=createGeneGroupDelivery([doc],{maxBytes:budget});
 const store=(id,body)=>{const x=request(large,id);assert.equal(x.next,1);x.res.end(body);};
 store('FBgg0000001',sized(40));
 store('FBgg0000002',sized(90)); // Forces eviction: 40 + 90 > 128.
 const bigHit=request(large,'FBgg0000002');assert.equal(bigHit.next,0);
 assert.equal(bigHit.res.headers['X-FlyBase-Group-Cache'],'HIT');
 assert.deepEqual(bigHit.res.body,sized(90));
 const evictedSmall=request(large,'FBgg0000001');assert.equal(evictedSmall.next,1);evictedSmall.res.end('{}');
 store('FBgg0000003',sized(budget)); // Exact full budget is admitted.
 assert.deepEqual(request(large,'FBgg0000003').res.body,sized(budget));
 const evictedLarge=request(large,'FBgg0000002');assert.equal(evictedLarge.next,1);evictedLarge.res.end('{}');
 store('FBgg0000004',sized(budget+1)); // Oversized response is delivered but never retained.
 const oversizedRetry=request(large,'FBgg0000004');assert.equal(oversizedRetry.next,1);oversizedRetry.res.end('{}');
 assert.deepEqual(request(large,'FBgg0000003').res.body,sized(budget));
 let release=0,cancel=0,finishCancel;
 const plugin={requestDidStart:()=>({didResolveOperation:async rc=>{rc.context.pgClient={processID:123};},willSendResponse:()=>{release++;}})};
 const pool={query:(sql,args)=>{assert.equal(sql,'select pg_cancel_backend($1)');assert.deepEqual(args,[123]);cancel++;return new Promise(r=>finishCancel=r);}};
 const work=new EventEmitter();const hooks=withGeneGroupCancellation(plugin,pool).requestDidStart({});const ctx={context:{geneGroupWork:work}};
 await hooks.didResolveOperation(ctx);work.aborted=true;work.emit('abort');work.emit('abort');assert.equal(cancel,1);
 const done=hooks.willSendResponse(ctx);assert.equal(release,0);finishCancel();await done;assert.equal(release,1);assert.equal(work.listenerCount('abort'),0);
 const normal=withGeneGroupCancellation(plugin,pool).requestDidStart({});await normal.didResolveOperation({context:{}});await normal.willSendResponse({});assert.equal(release,2);
 // Exercise Apollo's real error path: cancellation while waiting for a DB lease.
 const {ApolloServer,gql}=require('apollo-server');
 const disconnected=new EventEmitter();disconnected.aborted=true;let acquired=0,released=0;
 const actual=new ApolloServer({typeDefs:gql`type Query { ok: Boolean }`,resolvers:{Query:{ok:()=>true}},context:()=>({geneGroupWork:disconnected}),plugins:[withGeneGroupCancellation({requestDidStart:()=>({didResolveOperation:async rc=>{acquired++;rc.context.pgClient={processID:123}},willSendResponse:()=>{released++}})},{query:async()=>({})})]});
 const reply=await actual.executeOperation({query:'{ok}'});assert(reply.errors);assert.equal(acquired,1);assert.equal(released,1);assert.equal(disconnected.listenerCount('abort'),0);await actual.stop();
 console.log('Gene-group cache, isolation, coalescing, expiry, failure, disconnect, timeout, eviction and cancellation lease tests passed');
})().catch(e=>{console.error(e);process.exitCode=1});
