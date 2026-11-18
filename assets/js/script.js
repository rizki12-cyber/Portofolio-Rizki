/* ==========================================================
   COMIC CHRONICLES — INITIALIZATION, FORM VALIDATION & AOS
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animation Library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // 2. Dynamic Copyright Year (Real-time Footer)
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Contact Form Client-Side Validation
    const contactForm = document.getElementById('contactForm');
    const formSuccessAlert = document.getElementById('formSuccessAlert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
            } else {
                contactForm.classList.remove('was-validated');
                contactForm.reset();
                if (formSuccessAlert) {
                    formSuccessAlert.classList.remove('d-none');
                    setTimeout(() => {
                        formSuccessAlert.classList.add('d-none');
                    }, 6000);
                }
            }
        });
    }
});

/* ==========================================================
   COMIC CHRONICLES — LIVE VISITOR REVIEW SYSTEM
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const testimonialsList = document.getElementById('testimonialsList');
    const reviewCount = document.getElementById('reviewCount');
    const reviewFeedback = document.getElementById('reviewFeedback');

    const STORAGE_KEY = 'comic_testimonials';

    // Ambil data ulasan dari LocalStorage
    function getReviews() {
        try {
            const savedReviews = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || '[]'
            );
            return Array.isArray(savedReviews) ? savedReviews : [];
        } catch (error) {
            console.error('Gagal membaca ulasan:', error);
            return [];
        }
    }

    let reviews = getReviews();

    // Render seluruh ulasan
    function renderReviews() {
        if (!testimonialsList) return;

        testimonialsList.innerHTML = '';

        if (reviewCount) {
            reviewCount.textContent = reviews.length;
        }

        // Tampilan ketika belum ada ulasan
        if (reviews.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'font-dm text-muted text-center py-3 small';
            emptyMessage.textContent = 'Belum ada ulasan. Jadilah yang pertama!';
            testimonialsList.appendChild(emptyMessage);
            return;
        }

        reviews.forEach((item) => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'p-3 mb-3 border border-2 border-dark bg-surface position-relative';

            // Nama pengunjung
            const name = document.createElement('h5');
            name.className = 'font-archivo fs-6 mb-1 text-comic-red';
            name.textContent = item.name;

            // Isi ulasan
            const message = document.createElement('p');
            message.className = 'font-dm small mb-2 text-body';
            message.textContent = `"${item.message}"`;

            // Tanggal ulasan
            const date = document.createElement('small');
            date.className = 'font-dm text-muted d-block';
            date.style.fontSize = '0.75rem';
            date.textContent = item.date
                ? new Date(item.date).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })
                : '';

            reviewCard.appendChild(name);
            reviewCard.appendChild(message);
            reviewCard.appendChild(date);

            testimonialsList.appendChild(reviewCard);
        });
    }

    // Tampilkan notifikasi form
    function showFeedback(message, type) {
        if (!reviewFeedback) return;

        reviewFeedback.textContent = message;
        reviewFeedback.className = `mt-2 font-dm small text-center ${
            type === 'success' ? 'text-success' : 'text-danger'
        }`;

        // Hilang otomatis setelah 4 detik
        setTimeout(() => {
            reviewFeedback.textContent = '';
        }, 4000);
    }

    // Proses pengiriman ulasan
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('visitorName');
            const messageInput = document.getElementById('visitorMessage');

            const name = nameInput.value.trim();
            const message = messageInput.value.trim();

            // Validasi input kosong
            if (!name || !message) {
                showFeedback('Nama dan ulasan wajib diisi.', 'error');
                return;
            }

            // Validasi batas karakter
            if (name.length > 50 || message.length > 500) {
                showFeedback('Nama atau ulasan melebihi batas karakter.', 'error');
                return;
            }

            // Buat data ulasan baru
            const newReview = {
                id: Date.now(),
                name: name,
                message: message,
                date: new Date().toISOString()
            };

            // Tambahkan ke urutan paling atas
            reviews.unshift(newReview);

            try {
                // Simpan ke LocalStorage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

                // Perbarui tampilan secara langsung
                renderReviews();

                // Kosongkan form
                reviewForm.reset();

                // Notifikasi berhasil
                showFeedback('Terima kasih! Ulasan berhasil dikirim.', 'success');

            } catch (error) {
                reviews.shift(); // Batalkan jika gagal
                console.error('Gagal menyimpan ulasan:', error);
                showFeedback('Ulasan gagal disimpan. Silakan coba lagi.', 'error');
            }
        });
    }

    // Jalankan render ulasan pertama kali saat halaman dimuat
    renderReviews();
});

/* ==========================================================
   INTERACTIVE COMIC SPLASH SCREEN (WITH AUDIO TRIGGER)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('comicSplash');
    const startBtn = document.getElementById('startSplashBtn');
    const countdownArea = document.getElementById('countdownArea');
    const countdownNumber = document.getElementById('countdownNumber');
    const splashStatusText = document.getElementById('splashStatusText');

    if (!splashScreen || !startBtn) return;

    // Kunci scroll halaman utama di awal
    document.body.style.overflow = 'hidden';

    // Fungsi Web Audio API untuk efek suara komik retro
    function playComicSound(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'tick') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
                osc.start();
                osc.stop(ctx.currentTime + 0.12);
            } else if (type === 'ready') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
                osc.start();
                osc.stop(ctx.currentTime + 0.45);
            }
        } catch (e) {
            console.log("Audio error:", e);
        }
    }

    // Saat tombol "BUKA KOMIK" diklik oleh pengunjung:
    startBtn.addEventListener('click', () => {
        // Sembunyikan tombol, tampilkan angka hitung mundur
        startBtn.classList.add('d-none');
        countdownArea.classList.remove('d-none');

        let count = 3;
        countdownNumber.textContent = count;
        playComicSound('tick'); // Suara aktif karena dipicu oleh klik pengguna!

        const countdownInterval = setInterval(() => {
            count--;

            if (count > 0) {
                countdownNumber.textContent = count;
                playComicSound('tick');
            } else {
                clearInterval(countdownInterval);
                countdownNumber.textContent = "READY!";
                countdownNumber.classList.add('comic-boom');
                playComicSound('ready'); // Suara chime spesial
                
                if (splashStatusText) splashStatusText.textContent = "SELAMAT MEMBACA!";

                // Angkat layar splash ke atas setelah 500ms
                setTimeout(() => {
                    splashScreen.classList.add('splash-hidden');
                    document.body.style.overflow = ''; // Kembalikan fungsi scroll
                }, 500);
            }
        }, 700);
    });
});

console.log("%c⚡ COMIC CHRONICLES SYSTEM ACTIVE ⚡", "background: #111; color: #ffe600; padding: 6px 12px; font-weight: bold; font-family: monospace; border: 2px solid #111;");
console.log("Halo, Rekruter/Developer! Tertarik dengan kodenya? Mari terhubung: rizki@email.com");