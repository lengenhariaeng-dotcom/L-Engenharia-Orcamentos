const CACHE='l-eng-orcamentos-v7';
const ASSETS=['./','index.html','manifest.json','logo-l-engenharia.png','logo-topo.png','logo-rodape.png','icon-192.svg','icon-512.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.mode==='navigate'){
    event.respondWith(
      fetch(request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put('index.html',copy));
          return response;
        })
        .catch(()=>caches.open(CACHE).then(cache=>cache.match('index.html')))
    );
    return;
  }
  event.respondWith(
    caches.open(CACHE).then(cache=>
      cache.match(request).then(cached=>cached||fetch(request))
    )
  );
});
