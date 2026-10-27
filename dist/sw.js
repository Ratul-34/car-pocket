const CACHE='car-pocket-shell-v25';
const SHELL=['/','/index.html','/style.css','/app.js','/theme.js','/calendar.js','/car-photos.js','/manifest.webmanifest','/logo.png','/favicon.png','/apple-touch-icon.png','/icon.png','/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('car-pocket-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));return}if(SHELL.includes(url.pathname))event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)))});
