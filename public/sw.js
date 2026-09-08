const CACHE='balance-pocket-__BUILD__';
const ASSETS=/*PRECACHE*/['/','/manifest.webmanifest','/icon-192.png','/icon-512.png','/apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await Promise.all(ASSETS.map(async url=>{
  const response=await fetch(new Request(url,{credentials:'same-origin',cache:'reload'}));
  if(!response.ok||response.redirected||new URL(response.url).origin!==self.location.origin)throw Error('Offline setup requires the app to be open and signed in.');
  if(url==='/'&&!response.headers.get('content-type')?.includes('text/html'))throw Error('App shell unavailable.');
  await cache.put(url,response);
 }));
})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{
 const names=await caches.keys();await Promise.all(names.filter(k=>k.startsWith('balance-pocket-')&&k!==CACHE).map(k=>caches.delete(k)));
 await self.clients.claim();for(const client of await self.clients.matchAll())client.postMessage({type:'OFFLINE_READY'});
})());});
self.addEventListener('message',event=>{if(event.data?.type==='STATUS')event.waitUntil((async()=>{const cache=await caches.open(CACHE);if(await cache.match('/'))event.source?.postMessage({type:'OFFLINE_READY'});})());});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'&&url.pathname==='/'){event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match('/')||fetch(event.request);})());return;}
 if(ASSETS.includes(url.pathname)&&url.pathname!=='/')event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(url.pathname)||fetch(event.request);})());
});
