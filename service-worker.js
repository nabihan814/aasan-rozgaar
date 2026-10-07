self.addEventListener("install", function(event) {
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        self.clients.claim()
    );
});

// Network-only fetch handler
self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            // Optional fallback agar offline ho
            return caches.match(event.request);
        })
    );
});
