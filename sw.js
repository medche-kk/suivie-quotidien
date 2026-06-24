// sw.js — Service Worker Mizan
// Gère les notifications push et le cache

const CACHE_NAME = 'mizan-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Répondre aux clics sur les notifications
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Si Mizan est déjà ouvert, le ramener au premier plan
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon ouvrir Mizan
      if (self.clients.openWindow) {
        return self.clients.openWindow('./');
      }
    })
  );
});

// Optionnel : mettre en cache le fichier principal pour un fonctionnement hors-ligne
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
