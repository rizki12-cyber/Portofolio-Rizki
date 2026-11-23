/* ==========================================================
   COMIC CHRONICLES — DATA PROYEK (CASE STUDY) & DOKUMENTASI
   ========================================================== */

const projectsData = {
    "1": {
        title: "CASA RASA — E-Commerce Makanan Premium",
        category: "Website E-Commerce",
        description: "Website e-commerce makanan dengan tampilan modern dan sistem pengelolaan produk lengkap untuk transaksi kuliner online yang efisien.",
        objectives: "Menyediakan platform pemesanan makanan digital dengan antarmuka interaktif dan dashboard admin untuk mengelola katalog produk serta pesanan.",
        caseStudy: {
            process: "Merancang skema database relasional untuk kategori, menu, keranjang belanja (cart), dan detail transaksi. Setelah struktur backend selesai, dibangun antarmuka pelanggan untuk pemesanan dan halaman admin untuk verifikasi pembayaran serta pembaruan status pesanan.",
            challenge: "Menjaga sinkronisasi perhitungan total harga dan pemotongan stok produk di MySQL saat pengguna mengubah jumlah item di keranjang tanpa reload halaman, serta mencegah stok minus jika ada pesanan masuk bersamaan.",
            solution: "Menggunakan DB::transaction() pada Laravel saat proses checkout untuk mengunci integritas data stok, serta memanfaatkan JavaScript/AJAX untuk memperbarui kuantitas item di keranjang secara langsung."
        },
        features: ["Katalog Produk", "Keranjang Belanja", "Sistem Checkout", "Dashboard Admin", "Manajemen Produk"],
        technologies: ["Laravel", "PHP", "MySQL", "Bootstrap", "JavaScript", "Vite.js"],
        images: [
            "assets/images/projects/casarasa1.png",
            "assets/images/projects/casarasa2.png",
            "assets/images/projects/casarasa3.png"
        ]
    },
    "2": {
        title: "PoliklinikApp — Sistem Manajemen Klinik",
        category: "Sistem Manajemen",
        description: "Aplikasi manajemen poliklinik untuk mengelola data pasien, dokter, pendaftaran, pemeriksaan medis, dan pencatatan pembayaran secara terstruktur.",
        objectives: "Mendigitalkan proses administrasi klinik agar rekam medis, penjadwalan dokter, dan antrean pasien menjadi lebih cepat, teratur, dan akurat.",
        caseStudy: {
            process: "Memetakan alur kerja klinik mulai dari pasien mendaftar poli, pembuatan nomor antrean otomatis sesuai jadwal dokter, pemeriksaan medis oleh dokter, hingga kalkulasi rincian biaya obat dan jasa periksa.",
            challenge: "Mengatur pembatasan hak akses untuk 3 peran berbeda (Admin, Dokter, Pasien) agar rute tidak saling tumpang tindih, serta menghubungkan satu riwayat pemeriksaan dengan banyak jenis obat sekaligus di database.",
            solution: "Menerapkan Middleware khusus untuk memisahkan hak akses tiap role dan membuat tabel pivot (detail_periksa) dengan relasi Eloquent belongsToMany agar dokter bisa menginput banyak obat dalam satu kali pemeriksaan."
        },
        features: ["Autentikasi Berbasis Peran (Role-Based)", "Manajemen Pasien", "Manajemen Dokter", "Modul Pemeriksaan Medis", "Manajemen Pembayaran"],
        technologies: ["Laravel", "PHP", "MySQL", "Bootstrap"],
        images: [
            "assets/images/projects/klinik1.png",
            "assets/images/projects/klinik2.png",
            "assets/images/projects/klinik3.png"
        ]
    },
    "3": {
        title: "Sistem Informasi Desa Ciranjeng",
        category: "Sistem Informasi Desa",
        description: "Website informasi desa untuk menampilkan profil desa, berita terkini, agenda kegiatan, potensi lokal, dan statistik kependudukan masyarakat.",
        objectives: "Meningkatkan transparansi informasi publik pemerintahan desa serta mempermudah akses warga terhadap layanan dan berita seputar desa.",
        caseStudy: {
            process: "Mengumpulkan kebutuhan informasi dasar desa (profil perangkat desa, pengumuman, agenda, potensi wilayah, dan data statistik warga), lalu menyusun CMS sederhana agar operator desa mudah mengunggah berita maupun gambar.",
            challenge: "Mengolah data mentah penduduk menjadi statistik yang mudah dibaca publik tanpa membuat query database berat, serta mengatur ukuran unggahan gambar berita dari panel admin agar halaman tetap ringan diakses lewat jaringan seluler.",
            solution: "Menggunakan fungsi agregasi query builder Laravel untuk menghitung rekap data penduduk secara otomatis dan menerapkan validasi ukuran serta format file pada form upload gambar."
        },
        features: ["Profil Desa", "Manajemen Berita & Artikel", "Pengumuman & Agenda", "Galeri Foto", "Statistik Kependudukan"],
        technologies: ["Laravel", "PHP", "MySQL", "Bootstrap", "JavaScript"],
        images: [
            "assets/images/projects/crj1.png",
            "assets/images/projects/crj2.png",
            "assets/images/projects/crj3.png"
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // INISIALISASI MODAL PROYEK (CASE STUDY)
    // ==========================================
    const projectModalElement = document.getElementById('projectModal');
    
    if (projectModalElement && typeof bootstrap !== 'undefined') {
        const projectModal = bootstrap.Modal.getOrCreateInstance(projectModalElement);
        const projectModalLabel = document.getElementById('projectModalLabel');
        const projectModalBody = document.getElementById('projectModalBody');

        // Pastikan selector mendengarkan semua tombol view-project-btn
        const viewProjectBtns = document.querySelectorAll('.view-project-btn');

        viewProjectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = btn.getAttribute('data-project-id');
                const project = projectsData[projectId];

                if (project && projectModalLabel && projectModalBody) {
                    projectModalLabel.textContent = project.title;
                    
                    const imagesHTML = project.images.map((img, index) => `
                        <div class="col-md-4 mb-2">
                            <div class="border border-2 border-dark overflow-hidden bg-dark">
                                <img src="${img}" alt="${project.title} - Foto ${index + 1}" class="img-fluid w-100 object-fit-cover" style="height: 140px;" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop'">
                            </div>
                        </div>
                    `).join('');

                    projectModalBody.innerHTML = `
                        <div class="row mb-3">
                            ${imagesHTML}
                        </div>
                        <span class="badge bg-comic-red text-white font-bangers mb-2">${project.category}</span>
                        <p class="font-dm fs-6 mb-3">${project.description}</p>
                        
                        <div class="p-3 mb-3 border border-2 border-dark bg-body">
                            <h5 class="font-archivo fs-6 text-uppercase text-comic-red mb-2">Case Study: Proses & Tantangan</h5>
                            <div class="font-dm small">
                                <p class="mb-2"><strong>1. Proses Pengembangan:</strong><br>${project.caseStudy.process}</p>
                                <p class="mb-2"><strong>2. Tantangan Teknis:</strong><br>${project.caseStudy.challenge}</p>
                                <p class="mb-0"><strong>3. Solusi & Hasil:</strong><br>${project.caseStudy.solution || project.caseStudy.solusi}</p>
                            </div>
                        </div>

                        <h5 class="font-archivo fs-6 text-uppercase mb-1">Tujuan Proyek:</h5>
                        <p class="font-dm text-muted small mb-3">${project.objectives}</p>
                        
                        <h5 class="font-archivo fs-6 text-uppercase mb-1">Fitur Utama:</h5>
                        <ul class="font-dm small mb-3 ps-3">
                            ${project.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                        
                        <h5 class="font-archivo fs-6 text-uppercase mb-1">Teknologi yang Digunakan:</h5>
                        <div class="d-flex flex-wrap gap-1">
                            ${project.technologies.map(t => `<span class="badge border border-dark bg-surface text-dark">${t}</span>`).join('')}
                        </div>
                    `;
                    
                    projectModal.show();
                }
            });
        });
    }
});

/* ==========================================================
   COMIC CHRONICLES — ENHANCED CERTIFICATE MODAL SYSTEM
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const certModalEl = document.getElementById('certModal');
    const certificatesGrid = document.getElementById('certificatesGrid');

    if (!certModalEl || !certificatesGrid || typeof bootstrap === 'undefined') return;

    const certModal = bootstrap.Modal.getOrCreateInstance(certModalEl);

    // Elemen Modal
    const modalTitle = document.getElementById('certModalLabel');
    const modalCounter = document.getElementById('certModalCounter');
    const viewport = document.getElementById('certViewport');
    const imageWrapper = document.getElementById('certImageWrapper');
    const modalImg = document.getElementById('certModalImage');
    const loadingState = document.getElementById('certLoadingState');
    const errorState = document.getElementById('certErrorState');

    // Kontrol Toolbar
    const zoomInBtn = document.getElementById('certZoomInBtn');
    const zoomOutBtn = document.getElementById('certZoomOutBtn');
    const zoomResetBtn = document.getElementById('certZoomResetBtn');
    const fullscreenBtn = document.getElementById('certFullscreenBtn');
    const downloadBtn = document.getElementById('certDownloadBtn');

    // Navigasi
    const prevBtn = document.getElementById('certPrevBtn');
    const nextBtn = document.getElementById('certNextBtn');
    const prevFooterBtn = document.getElementById('certPrevFooterBtn');
    const nextFooterBtn = document.getElementById('certNextFooterBtn');

    // Detail Metadata
    const detailTitle = document.getElementById('certDetailTitle');
    const detailPenerbit = document.getElementById('certDetailPenerbit');
    const detailTahun = document.getElementById('certDetailTahun');
    const detailBerlaku = document.getElementById('certDetailBerlaku');
    const detailBidang = document.getElementById('certDetailBidang');
    const detailPredikat = document.getElementById('certDetailPredikat');

    // Opsional: Nomor & Verifikasi
    const nomorRow = document.getElementById('certNomorRow');
    const detailNomor = document.getElementById('certDetailNomor');
    const copyNomorBtn = document.getElementById('certCopyNomorBtn');
    const copyFeedback = document.getElementById('certCopyFeedback');
    const verifyWrapper = document.getElementById('certVerifyWrapper');
    const verifyBtn = document.getElementById('certVerifyBtn');

    // Kumpulkan data dari semua kartu sertifikat yang ada di #certificatesGrid
    const certCards = Array.from(certificatesGrid.querySelectorAll('.comic-cert-card'));
    const certificatesData = certCards.map((card, index) => {
        const trigger = card.querySelector('.view-cert-btn') || card.querySelector('.cert-thumb');
        const thumb = card.querySelector('.cert-thumb');
        const getAttr = (attr) => (trigger && trigger.getAttribute(attr)) || (thumb && thumb.getAttribute(attr)) || '';

        return {
            index,
            img: getAttr('data-img'),
            title: getAttr('data-title') || 'Sertifikat',
            penerbit: getAttr('data-penerbit') || '-',
            tahun: getAttr('data-tahun') || '-',
            berlaku: getAttr('data-berlaku') || '-',
            bidang: getAttr('data-bidang') || '-',
            predikat: getAttr('data-predikat') || '-',
            nomor: getAttr('data-nomor').trim(),
            verifyUrl: getAttr('data-verify-url').trim()
        };
    });

    if (certificatesData.length === 0) return;

    let currentIndex = 0;
    let currentZoom = 1;
    let lastFocusedTrigger = null;

    const ZOOM_STEP = 0.25;
    const MIN_ZOOM = 0.75;
    const MAX_ZOOM = 2.5;

    function applyZoom() {
        imageWrapper.style.transform = `scale(${currentZoom})`;
        zoomResetBtn.textContent = `${Math.round(currentZoom * 100)}%`;
        zoomOutBtn.disabled = currentZoom <= MIN_ZOOM;
        zoomInBtn.disabled = currentZoom >= MAX_ZOOM;
    }

    function resetZoom() {
        currentZoom = 1;
        applyZoom();
    }

    function renderCertificate(index) {
        if (index < 0) index = certificatesData.length - 1;
        if (index >= certificatesData.length) index = 0;
        currentIndex = index;

        const item = certificatesData[currentIndex];
        resetZoom();

        // Update indikator & judul
        modalTitle.textContent = item.title;
        modalCounter.textContent = `${currentIndex + 1} / ${certificatesData.length}`;

        // Update detail informasi
        detailTitle.textContent = item.title;
        detailPenerbit.textContent = item.penerbit;
        detailTahun.textContent = item.tahun;
        detailBerlaku.textContent = item.berlaku;
        detailBidang.textContent = item.bidang;
        detailPredikat.textContent = item.predikat;

        // Update tombol download
        downloadBtn.href = item.img;
        const safeFilename = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const ext = item.img.split('.').pop() || 'jpg';
        downloadBtn.setAttribute('download', `${safeFilename}.${ext}`);

        // Tampilkan Nomor Sertifikat HANYA jika tersedia di atribut data-nomor
        if (item.nomor) {
            nomorRow.classList.remove('d-none');
            detailNomor.value = item.nomor;
            copyFeedback.classList.add('d-none');
        } else {
            nomorRow.classList.add('d-none');
            detailNomor.value = '';
        }

        // Tampilkan Link Verifikasi HANYA jika tersedia di atribut data-verify-url
        if (item.verifyUrl) {
            verifyWrapper.classList.remove('d-none');
            verifyBtn.href = item.verifyUrl;
        } else {
            verifyWrapper.classList.add('d-none');
            verifyBtn.href = '#';
        }

        // Loading & Error State saat memuat gambar
        loadingState.classList.remove('d-none');
        errorState.classList.add('d-none');
        imageWrapper.classList.add('d-none');

        const loader = new Image();
        loader.onload = () => {
            if (currentIndex !== index) return; // Abaikan jika pengguna sudah berpindah slide
            modalImg.src = item.img;
            modalImg.alt = item.title;
            loadingState.classList.add('d-none');
            errorState.classList.add('d-none');
            imageWrapper.classList.remove('d-none');
        };
        loader.onerror = () => {
            if (currentIndex !== index) return;
            loadingState.classList.add('d-none');
            imageWrapper.classList.add('d-none');
            errorState.classList.remove('d-none');
        };
        loader.src = item.img;
    }

    // Event Listener Pembuka Modal (Klik & Keyboard Enter/Space pada Thumbnail atau Tombol)
    certCards.forEach((card, idx) => {
        const triggers = card.querySelectorAll('.cert-thumb, .view-cert-btn');
        triggers.forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                lastFocusedTrigger = el;
                renderCertificate(idx);
                certModal.show();
            });

            if (el.classList.contains('cert-thumb')) {
                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        lastFocusedTrigger = el;
                        renderCertificate(idx);
                        certModal.show();
                    }
                });
            }
        });
    });

    // Kontrol Zoom
    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < MAX_ZOOM) {
            currentZoom = Math.min(MAX_ZOOM, currentZoom + ZOOM_STEP);
            applyZoom();
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > MIN_ZOOM) {
            currentZoom = Math.max(MIN_ZOOM, currentZoom - ZOOM_STEP);
            applyZoom();
        }
    });

    zoomResetBtn.addEventListener('click', resetZoom);

    // Kontrol Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            if (viewport.requestFullscreen) {
                viewport.requestFullscreen().catch(() => {});
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        }
    });

    document.addEventListener('fullscreenchange', () => {
        const icon = fullscreenBtn.querySelector('i');
        if (document.fullscreenElement === viewport) {
            icon.className = 'bi bi-fullscreen-exit';
            fullscreenBtn.title = 'Keluar Layar Penuh';
        } else {
            icon.className = 'bi bi-arrows-fullscreen';
            fullscreenBtn.title = 'Layar Penuh (Fullscreen)';
        }
    });

    // Navigasi Prev / Next
    const goPrev = () => renderCertificate(currentIndex - 1);
    const goNext = () => renderCertificate(currentIndex + 1);

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);
    prevFooterBtn.addEventListener('click', goPrev);
    nextFooterBtn.addEventListener('click', goNext);

    // Copy Nomor Sertifikat
    copyNomorBtn.addEventListener('click', () => {
        if (!detailNomor.value) return;
        navigator.clipboard.writeText(detailNomor.value).then(() => {
            copyFeedback.classList.remove('d-none');
            setTimeout(() => copyFeedback.classList.add('d-none'), 2500);
        });
    });

    // Dukungan Keyboard (ArrowLeft, ArrowRight, ESC) saat modal terbuka
    document.addEventListener('keydown', (e) => {
        if (!certModalEl.classList.contains('show')) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goNext();
        }
    });

    // Focus Management & Reset saat modal ditutup
    certModalEl.addEventListener('hidden.bs.modal', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
        resetZoom();
        if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
            lastFocusedTrigger.focus();
        }
    });
});