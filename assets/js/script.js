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

    function renderReviews() {
        if (!testimonialsList) return;

        testimonialsList.innerHTML = '';

        if (reviewCount) {
            reviewCount.textContent = reviews.length;
        }

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

            const name = document.createElement('h5');
            name.className = 'font-archivo fs-6 mb-1 text-comic-red';
            name.textContent = item.name;

            const message = document.createElement('p');
            message.className = 'font-dm small mb-2 text-body';
            message.textContent = `"${item.message}"`;

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

    function showFeedback(message, type) {
        if (!reviewFeedback) return;

        reviewFeedback.textContent = message;
        reviewFeedback.className = `mt-2 font-dm small text-center ${
            type === 'success' ? 'text-success' : 'text-danger'
        }`;

        setTimeout(() => {
            reviewFeedback.textContent = '';
        }, 4000);
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('visitorName');
            const messageInput = document.getElementById('visitorMessage');

            const name = nameInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !message) {
                showFeedback('Nama dan ulasan wajib diisi.', 'error');
                return;
            }

            if (name.length > 50 || message.length > 500) {
                showFeedback('Nama atau ulasan melebihi batas karakter.', 'error');
                return;
            }

            const newReview = {
                id: Date.now(),
                name: name,
                message: message,
                date: new Date().toISOString()
            };

            reviews.unshift(newReview);

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
                renderReviews();
                reviewForm.reset();
                showFeedback('Terima kasih! Ulasan berhasil dikirim.', 'success');
            } catch (error) {
                reviews.shift();
                console.error('Gagal menyimpan ulasan:', error);
                showFeedback('Ulasan gagal disimpan. Silakan coba lagi.', 'error');
            }
        });
    }

    renderReviews();
});

/* ==========================================================
   INTERACTIVE COMIC SPLASH SCREEN (AUDIO EFX ONLY)
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

    let cachedAudioCtx = null;
    function getAudioCtx() {
        if (cachedAudioCtx) return cachedAudioCtx;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;
        cachedAudioCtx = new AudioContext();
        return cachedAudioCtx;
    }

    function playComicSound(type) {
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;

            if (ctx.state === 'suspended') ctx.resume();

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
            console.warn("Audio error:", e);
        }
    }

    startBtn.addEventListener('click', () => {
        startBtn.classList.add('d-none');
        countdownArea.classList.remove('d-none');

        let count = 3;
        countdownNumber.textContent = count;
        playComicSound('tick');

        const countdownInterval = setInterval(() => {
            count--;

            if (count > 0) {
                countdownNumber.textContent = count;
                playComicSound('tick');
            } else {
                clearInterval(countdownInterval);
                countdownNumber.textContent = "READY!";
                countdownNumber.classList.add('comic-boom');
                playComicSound('ready');

                if (splashStatusText) splashStatusText.textContent = "SELAMAT MEMBACA!";

                // (Perbaikan: Pemanggilan playDailyMusic otomatis dihapus agar lagu tidak menyala sendiri)

                setTimeout(() => {
                    splashScreen.classList.add('splash-hidden');
                    document.body.style.overflow = '';
                }, 500);
            }
        }, 700);
    });
});

/* ==========================================================
   MOTO HARIAN & SOUNDTRACK HARIAN (HTML5 AUDIO)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // MOTO HARIAN OTOMATIS BERDASARKAN HARI
    // ==========================================
    const dailyMottoText = document.getElementById('dailyMottoText');
    const mottoDayLabel = document.getElementById('mottoDayLabel');

    if (dailyMottoText) {
        const mottos = [
            { day: "MINGGU", quote: "Seperti senja yang selalu indah, ada kalanya kita perlu berhenti sejenak untuk menikmati kehadiran seseorang yang berarti." },
            { day: "SENIN", quote: "Seminggu boleh dimulai dengan banyak rencana, tetapi satu hal yang selalu kuharapkan adalah tetap ada kamu di dalamnya." },
            { day: "SELASA", quote: "Seperti kode yang terus kususun hingga sempurna, perasaanku padamu tak pernah lelah menemukan alasan untuk bertahan." },
            { day: "RABU", quote: "Jika hidup adalah perjalanan penuh error, semoga kamu selalu menjadi bagian yang tidak ingin kuhapus dari ceritaku." },
            { day: "KAMIS", quote: "Aku tidak membutuhkan hari yang sempurna, cukup seseorang yang membuat hari biasa terasa istimewa." },
            { day: "JUMAT", quote: "Di antara ribuan hal yang ingin kuselesaikan, ada satu doa yang tak pernah lupa kupanjatkan: semoga kita tetap bersama." },
            { day: "SABTU", quote: "Kalau waktu bisa kuatur seperti algoritma, aku ingin setiap akhir pekan selalu punya cerita bersamamu." }
        ];

        const todayIndex = new Date().getDay();
        const todayMotto = mottos[todayIndex];

        dailyMottoText.textContent = `"${todayMotto.quote}"`;
        if (mottoDayLabel) {
            mottoDayLabel.textContent = `EDISI HARI ${todayMotto.day}`;
        }
    }

    // ==========================================
    // SOUNDTRACK HARIAN - HTML5 AUDIO PLAYER
    // ==========================================
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const dailySongTitle = document.getElementById('dailySongTitle');
    const musicDayLabel = document.getElementById('musicDayLabel');
    const dailyYoutubePlayer = document.getElementById('dailyYoutubePlayer'); // Wadah status audio

    if (musicToggleBtn && dailySongTitle && dailyYoutubePlayer) {

        const songs = [
            { day: "MINGGU", title: "Satu-Satu", artist: "Idgitaf", audioUrl: "assets/audio/minggu.mp3" },
            { day: "SENIN", title: "Komang", artist: "Raim Laode", audioUrl: "assets/audio/senin.mp3" },
            { day: "SELASA", title: "Akad", artist: "Payung Teduh", audioUrl: "assets/audio/selasa.mp3" },
            { day: "RABU", title: "Mesin Waktu", artist: "Budi Doremi", audioUrl: "assets/audio/rabu.mp3" },
            { day: "KAMIS", title: "Teman Hidup", artist: "Tulus", audioUrl: "assets/audio/kamis.mp3" },
            { day: "JUMAT", title: "Bertaut", artist: "Nadin Amizah", audioUrl: "assets/audio/jumat.mp3" },
            { day: "SABTU", title: "Monokrom", artist: "Tulus", audioUrl: "assets/audio/sabtu.mp3" }
        ];

        const todayIndex = new Date().getDay();
        const todaySong = songs[todayIndex];

        dailySongTitle.textContent = `${todaySong.title} — ${todaySong.artist}`;
        if (musicDayLabel) {
            musicDayLabel.textContent = `EDISI HARI ${todaySong.day}`;
        }

        // Inisialisasi objek Audio HTML5
        const audioElement = new Audio(todaySong.audioUrl);
        audioElement.volume = 0.4;
        audioElement.loop = true;

        let isPlaying = false;

        function updateButtonUI() {
            if (isPlaying) {
                musicToggleBtn.textContent = '⏸ JEDA';
                dailyYoutubePlayer.innerHTML = `<span class="font-dm small text-success fw-bold">🎵 Sedang memutar soundtrack harian...</span>`;
            } else {
                musicToggleBtn.textContent = '▶ PUTAR';
                dailyYoutubePlayer.innerHTML = `<span class="font-dm small text-muted">Audio dijeda. Tekan putar untuk mendengarkan.</span>`;
            }
        }

        // Tombol hanya merespons jika diklik manual oleh pengguna
        musicToggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                audioElement.pause();
                isPlaying = false;
                updateButtonUI();
            } else {
                audioElement.play().then(() => {
                    isPlaying = true;
                    updateButtonUI();
                }).catch(error => {
                    console.warn("Gagal memutar audio:", error);
                    dailyYoutubePlayer.innerHTML = `<span class="font-dm small text-danger">⚠️ Pastikan file MP3 sudah ada di folder assets/audio/</span>`;
                });
            }
        });

        audioElement.addEventListener('ended', () => {
            isPlaying = false;
            updateButtonUI();
        });

        updateButtonUI();
    }
});

/* ==========================================================
   SMOOTH COMIC INTRO OVERLAY (MINIMALIST & ONCE PER SESSION)
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('comicIntroOverlay');
    const closeIntroBtn = document.getElementById('closeIntroBtn');
    const introTypingTitle = document.getElementById('introTypingTitle');

    if (!introOverlay || !closeIntroBtn) return;

    // Cek apakah intro sudah dilihat pada sesi ini
    const hasSeenIntro = sessionStorage.getItem('comic_intro_seen');

    if (hasSeenIntro) {
        introOverlay.remove();
        document.body.style.overflow = '';
    } else {
        document.body.style.overflow = 'hidden';

        // Efek Mengetik Teks Judul (Versi Ringkas)
        const titleText = "COMIC CHRONICLES";
        let charIndex = 0;
        function typeWriter() {
            if (introTypingTitle && charIndex < titleText.length) {
                introTypingTitle.textContent += titleText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 60);
            }
        }
        typeWriter();

        function dismissIntro() {
            introOverlay.classList.add('fade-out');
            document.body.style.overflow = '';
            
            // Simpan ke sessionStorage agar tidak muncul lagi saat navigasi ke CV & kembali
            sessionStorage.setItem('comic_intro_seen', 'true');

            setTimeout(() => {
                introOverlay.remove();
            }, 350);
        }

        // Event listener klik tombol masuk & tombol ESC
        closeIntroBtn.addEventListener('click', dismissIntro);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.style.overflow === 'hidden') {
                dismissIntro();
            }
        });
    }
});

/* ==========================================================
   CONSOLE EASTER EGG
   ========================================================== */

console.log("%c⚡ COMIC CHRONICLES SYSTEM ACTIVE ⚡", "background: #111; color: #ffe600; padding: 6px 12px; font-weight: bold; font-family: monospace; border: 2px solid #111;");
console.log("Halo, Rekruter/Developer! Tertarik dengan kodenya? Mari terhubung: rizki@email.com");