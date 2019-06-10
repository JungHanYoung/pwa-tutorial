const staticCacheName = 'site-static-v1'
const dynamicCacheName = 'site-dynamic-v1'
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
];

// 캐시 사이즈 제한하기
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

// install service worker   // 앱 다운로드 이벤트
self.addEventListener('install', (evt) => {
    // console.log('service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets')
            cache.addAll(assets)
        })
    );
});

// activate event // 앱 활성화 상태
self.addEventListener('activate', evt => {
    // console.log('service worker has been activated')
    evt.waitUntil(
        caches.keys().then(keys => {
            console.log(keys);  //

            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    )
})

// fetch event - image, css, js
self.addEventListener('fetch', evt => {
    // console.log('fetch event', evt)
    // evt.respondWith(
    //     caches.match(evt.request).then(cacheRes => {
    //         // cache에 존재 -> cache에 있는 데이터로 대체
    //         return cacheRes || fetch(evt.request).then(fetchRes => {
    //             // Dynamic Cache
    //             return caches.open(dynamicCacheName).then(cache => {
    //                 cache.put(evt.request.url, fetchRes.clone());
    //                 limitCacheSize(dynamicCacheName, 3);
    //                 return fetchRes
    //             })
    //         })
    //     }).catch(() => {
    //         if (evt.request.url.indexOf('.html') > -1) {
    //             return caches.match('/pages/fallback.html');
    //         }
    //     })
    // )
})

