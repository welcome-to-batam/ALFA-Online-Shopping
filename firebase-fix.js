// ===== FIREBASE CONFIG & INITIALIZATION =====
const firebaseConfig = {
    apiKey: "AIzaSyD71_Gk4N4xdVPzp62FUH5iS4uNHQdX1h4",
    authDomain: "alfa-online-shopping.firebaseapp.com",
    databaseURL: "https://alfa-online-shopping-default-rtdb.asia-southeast1.firebaseio.com",
    projectId: "alfa-online-shopping",
    storageBucket: "alfa-online-shopping.firebasestorage.app",
    messagingSenderId: "340337147242",
    appId: "1:340337147242:web:bf711d13e314f8eaa30c13"
};

// Inisialisasi Firebase dengan pengecekan
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

// ===== FUNGSI KIRIM ULASAN (DIPERBAIKI) =====
function kirimUlasanKeFirebase() {
    const nama = document.getElementById('reviewer-name').value.trim();
    const bintang = document.getElementById('reviewer-rating').value;
    const ulasan = document.getElementById('reviewer-text').value.trim();

    // Validasi lengkap
    if (nama === "") {
        alert("❌ Nama tidak boleh kosong!");
        return;
    }
    
    if (ulasan === "") {
        alert("❌ Ulasan tidak boleh kosong!");
        return;
    }
    
    if (!bintang) {
        alert("❌ Pilih rating bintang terlebih dahulu!");
        return;
    }

    // Persiapan data ulasan
    const dataUlasanBaru = {
        namaPembeli: nama,
        ratingBintang: parseInt(bintang),
        isiUlasan: ulasan,
        waktuKirim: new Date().toLocaleString("id-ID"),
        timestamp: Date.now()
    };

    // Disable tombol saat loading
    const btnKirim = document.querySelector('button[onclick="kirimUlasanKeFirebase()"]');
    if (btnKirim) {
        btnKirim.disabled = true;
        btnKirim.innerText = "Mengirim...";
    }

    // Kirim ke Firebase
    database.ref('ulasan_alfa').push(dataUlasanBaru)
        .then(() => {
            alert("✅ Terima kasih! Ulasan Anda telah berhasil dikirim ke database! 🎉");
            
            // Reset form
            document.getElementById('reviewer-name').value = "";
            document.getElementById('reviewer-text').value = "";
            document.getElementById('reviewer-rating').value = "5";
            
            // Tampilkan ulasan baru secara real-time
            muatUlasanDariFirebase();
        })
        .catch((error) => {
            console.error("Error Firebase:", error);
            let pesanError = "❌ Gagal mengirim ulasan. ";
            
            // Deteksi jenis error
            if (error.code === "PERMISSION_DENIED") {
                pesanError += "Database rules tidak mengizinkan. Hubungi admin.";
            } else if (error.message.includes("network")) {
                pesanError += "Periksa koneksi internet Anda.";
            } else {
                pesanError += error.message;
            }
            
            alert(pesanError);
        })
        .finally(() => {
            // Enable tombol kembali
            if (btnKirim) {
                btnKirim.disabled = false;
                btnKirim.innerText = "Kirim Ulasan";
            }
        });
}

// ===== FUNGSI MENAMPILKAN ULASAN (DIPERBAIKI) =====
function muatUlasanDariFirebase() {
    const wadahUlasan = document.getElementById('latest-reviews-container');
    
    if (!wadahUlasan) {
        console.warn("Element 'latest-reviews-container' tidak ditemukan!");
        return;
    }

    database.ref('ulasan_alfa').orderByChild('timestamp').limitToLast(5).on('value', (snapshot) => {
        wadahUlasan.innerHTML = '';
        
        if (snapshot.exists()) {
            const ulasanArray = [];
            
            snapshot.forEach((childSnapshot) => {
                ulasanArray.unshift(childSnapshot.val());
            });

            ulasanArray.forEach((ulasan) => {
                const bintangHTML = '⭐'.repeat(parseInt(ulasan.ratingBintang));
                const htmlUlasan = `
                    <div style="border-left: 4px solid #ffcc00; padding-left: 10px; margin-bottom: 15px; background: #fafafa; padding: 10px; border-radius: 6px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <strong style="color: #222;">${escapeHtml(ulasan.namaPembeli)}</strong>
                            <span style="font-size: 12px; color: #888;">${ulasan.waktuKirim}</span>
                        </div>
                        <div style="color: #ffcc00; font-size: 14px; margin: 5px 0;">
                            ${bintangHTML}
                        </div>
                        <p style="margin: 8px 0; color: #555; font-size: 13px; line-height: 1.5;">
                            ${escapeHtml(ulasan.isiUlasan)}
                        </p>
                    </div>
                `;
                wadahUlasan.innerHTML += htmlUlasan;
            });
        } else {
            wadahUlasan.innerHTML = '<p style="color: #888; font-size: 13px; text-align: center; font-style: italic;">Belum ada ulasan. Jadilah yang pertama! ✨</p>';
        }
    }, (error) => {
        console.error("Error membaca ulasan:", error);
        wadahUlasan.innerHTML = '<p style="color: #d32f2f; font-size: 13px;">⚠️ Gagal memuat ulasan. Coba refresh halaman.</p>';
    });
}

// ===== FUNGSI ESCAPE HTML (SECURITY) =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== JALANKAN SAAT HALAMAN SELESAI LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    muatUlasanDariFirebase();
});
