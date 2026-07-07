const CACHE_NAME = 'alfa-cache-v37'; // Naikkan versi ke v37
const assets = [
  '/ALFA-Online-Shopping/',
  '/ALFA-Online-Shopping/index.html',
  '/ALFA-Online-Shopping/manifest.json',
  
  // PASTIKAN PATH DI BAWAH INI SAMA PERSIS DENGAN DI INDEX.HTML
  '/ALFA-Online-Shopping/logoijo.jpg',
  '/ALFA-Online-Shopping/logomerahmuda.jpg',
  '/ALFA-Online-Shopping/jembatanbarelang.jpg',
  '/ALFA-Online-Shopping/qrcode.png',
  '/ALFA-Online-Shopping/twsproduk1.jpg',
  '/ALFA-Online-Shopping/twsproduk1.mp4'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Menggunakan Promise.allSettled agar jika ada 1 gambar salah nama, gambar lain tetap sukses masuk cache
      return Promise.allSettled(
        assets.map(url => {
          return cache.add(url).catch(err => console.log('Gagal cache file:', url, err));
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
