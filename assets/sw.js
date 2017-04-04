import swLib from 'sw-lib';
import fileManifest from './file-manifest';

const CACHE_NAME = 'philipwalton:v1';

const networkFirstStrategy = swLib.networkFirst({
  cacheName: CACHE_NAME,
});
const cdnStrategy = swLib.staleWhileRevalidate({
  cacheName: CACHE_NAME,
  cacheableResponse: {statuses: [0, 200]},
});

swLib.router.registerRoute(
    /^https?:\/\/(fonts|ajax)\.(googleapis|gstatic)\.com/, cdnStrategy);

swLib.router.registerRoute(
    /^https?:\/\/www\.google\-analytics\.com\/analytics\.js/, cdnStrategy);

swLib.router.registerRoute('/:page/', networkFirstStrategy);
swLib.router.registerRoute('/articles/:article/', networkFirstStrategy);

swLib.cacheRevisionedAssets(fileManifest);


self.addEventListener('install', (event) => {
  const cacheOpenClientPages = self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clients) => {
    const urls = clients.map((client) => client.url);
    return self.caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urls);
    });
  });

  event.waitUntil(cacheOpenClientPages);
});
