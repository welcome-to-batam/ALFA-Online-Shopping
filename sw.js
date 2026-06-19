const CACHE_NAME = 'alfa-cache-v1';
const assets = [
  '/ALFA-Online-Shopping/',
  '/ALFA-Online-Shopping/index.html',
  // Masukkan file CSS, JS, atau gambar produk utama Anda di bawah ini:
  '/ALFA-Online-Shopping/logo-alfa-192.png',
  '/ALFA-Online-Shopping/logo-alfa-512.png'
];

// Menyimpan aset ke cache saat instalasi
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Mengambil aset dari cache jika offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});

