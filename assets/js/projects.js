/* ==========================================================
   COMIC CHRONICLES — DATA PROYEK DENGAN 3 FOTO DOKUMENTASI
   ========================================================== */

const projectsData = {
    1: {
        title: "CASA RASA — E-Commerce Makanan Premium",
        category: "Website E-Commerce",
        description: "Website e-commerce makanan dengan tampilan modern dan sistem pengelolaan produk lengkap untuk transaksi kuliner online yang efisien.",
        objectives: "Menyediakan platform pemesanan makanan digital dengan antarmuka interaktif dan dashboard admin yang mudah digunakan untuk mengelola katalog produk serta pesanan.",
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
    if (!projectModalElement) return;
    
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

    // Inisialisasi Modal Sertifikat
    const certModalElement = document.getElementById('certModal');
    if (!certModalElement) return;

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
});