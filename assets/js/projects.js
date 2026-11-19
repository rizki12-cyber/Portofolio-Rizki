/* ==========================================================
   COMIC CHRONICLES — DATA PROYEK (CASE STUDY) & DOKUMENTASI
   ========================================================== */

const projectsData = {
    1: {
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
    2: {
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
    3: {
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
    // Inisialisasi Modal Proyek
    const projectModalElement = document.getElementById('projectModal');
    if (projectModalElement) {
        const projectModal = new bootstrap.Modal(projectModalElement);
        const projectModalLabel = document.getElementById('projectModalLabel');
        const projectModalBody = document.getElementById('projectModalBody');

        document.querySelectorAll('.view-project-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = btn.getAttribute('data-project-id');
                const project = projectsData[projectId];

                if (project) {
                    projectModalLabel.textContent = project.title;
                    
                    // Render 3 foto dokumentasi dalam layout grid responsif di dalam modal
                    const imagesHTML = project.images.map((img, index) => `
                        <div class="col-md-4 mb-2">
                            <div class="border border-2 border-dark overflow-hidden">
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
                                <p class="mb-0"><strong>3. Solusi & Hasil:</strong><br>${project.caseStudy.solusi || project.caseStudy.solution}</p>
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

    // Inisialisasi Modal Sertifikat
    const certModalElement = document.getElementById('certModal');
    if (certModalElement) {
        const certModal = new bootstrap.Modal(certModalElement);
        const certModalLabel = document.getElementById('certModalLabel');
        const certModalImage = document.getElementById('certModalImage');

        document.querySelectorAll('.view-cert-btn, .cert-thumb').forEach(el => {
            el.addEventListener('click', () => {
                const imgSrc = el.getAttribute('data-img');
                const imgTitle = el.getAttribute('data-title');

                if (imgSrc) {
                    certModalLabel.textContent = imgTitle || 'Pratinjau Sertifikat';
                    certModalImage.src = imgSrc;
                    certModalImage.onerror = function() {
                        this.src = 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop';
                    };
                    certModal.show();
                }
            });
        });
    }
});