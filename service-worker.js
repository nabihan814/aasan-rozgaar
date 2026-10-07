self.addEventListener("install", function(event) {
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        self.clients.claim()
    );
});

// IMPORTANT:
// Website ki files offline cache nahi hongi.
// Browser network se files load karega.
self.addEventListener("fetch", function(event) {
    // Network only
});
