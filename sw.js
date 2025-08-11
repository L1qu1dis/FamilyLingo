// Service Worker v3: offline + new assets cached
const CACHE='duolinglight-v3';
const ASSETS=[
  './','./index.html','./assets/style.css','./assets/app.js',
  './icons/icon-192.png','./icons/icon-512.png','./manifest.webmanifest',
  './assets/success.wav'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  e.respondWith(
    caches.match(req).then(res=> res || fetch(req).then(net=>{
      const copy=net.clone(); caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
      return net;
    }).catch(()=> caches.match('./index.html')))
  );
});