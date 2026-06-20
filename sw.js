const CACHE_NAME = 'alfa-cache-v2'; // Mengubah nama cache ke v2 agar browser memperbarui data
const assets = [
  '/ALFA-Online-Shopping/',
  '/ALFA-Online-Shopping/index.html',
  
  // File Gambar Utama Proyek Anda
  '/ALFA-Online-Shopping/logoijo.jpg',
  '/ALFA-Online-Shopping/logomerahmuda.jpg',
  '/ALFA-Online-Shopping/jembatanbarelang.jpg',
  '/ALFA-Online-Shopping/qrcode.png',
  
  // Gambar Produk & Media
  '/ALFA-Online-Shopping/twsbiru1.jpg',
  '/ALFA-Online-Shopping/tws.mp4',
  
  // File Konfigurasi PWA (opsional tapi disarankan masuk cache)
  '/ALFA-Online-Shopping/manifest.json'
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
