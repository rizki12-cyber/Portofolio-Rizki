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