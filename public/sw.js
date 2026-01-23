// ============================================
// SERVICE WORKER - PWA OFFLINE SUPPORT
// ============================================

const CACHE_NAME = 'sellast-pos-v1';
const STATIC_CACHE = 'sellast-static-v1';
const DYNAMIC_CACHE = 'sellast-dynamic-v1';
const OFFLINE_QUEUE = 'sellast-offline-queue';

// URLs to cache immediately
const STATIC_ASSETS = [
    '/',
    '/admin',
    '/admin/pos',
    '/auth',
    '/manifest.json',
    '/offline.html'
];

// API routes to cache with network-first strategy
const API_ROUTES = [
    '/api/v1/products',
    '/api/v1/branches'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests for caching (but queue POSTs for offline)
    if (request.method !== 'GET') {
        if (request.method === 'POST' && url.pathname.includes('/api/v1/sales')) {
            event.respondWith(handleOfflineSale(request));
        }
        return;
    }

    // API routes - network first, cache fallback
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Static assets - cache first
    event.respondWith(cacheFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        throw error;
    }
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        return new Response(
            JSON.stringify({ success: false, error: 'Offline', offline: true }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Handle offline sales - queue for later sync
async function handleOfflineSale(request) {
    try {
        const response = await fetch(request.clone());
        return response;
    } catch (error) {
        // Store sale in IndexedDB for later sync
        const saleData = await request.json();
        await queueOfflineSale(saleData);

        return new Response(
            JSON.stringify({
                success: true,
                offline: true,
                message: 'Venta guardada localmente. Se sincronizará cuando vuelva la conexión.',
                localId: `offline-${Date.now()}`
            }),
            {
                status: 202,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Queue sale for offline sync
async function queueOfflineSale(saleData) {
    // Use IndexedDB via message to main thread
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'QUEUE_OFFLINE_SALE',
            data: { ...saleData, timestamp: Date.now() }
        });
    });
}

// Listen for sync events
self.addEventListener('sync', (event) => {
    console.log('[SW] Sync event:', event.tag);
    if (event.tag === 'sync-offline-sales') {
        event.waitUntil(syncOfflineSales());
    }
});

// Sync offline sales when back online
async function syncOfflineSales() {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({ type: 'SYNC_OFFLINE_SALES' });
    });
}

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'Sellast POS';
    const options = {
        body: data.body || 'Nueva notificación',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: data.url || '/admin',
        actions: [
            { action: 'open', title: 'Ver' },
            { action: 'close', title: 'Cerrar' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});

console.log('[SW] Service Worker loaded');
