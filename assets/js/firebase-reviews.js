
/* ==========================================================
   COMIC CHRONICLES — FIREBASE LIVE REVIEW SYSTEM
   Firebase SDK 13.4.0
   ========================================================== */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from
    "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// 1. FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyCpiTP6zbnJcoaZVCW7hJvDXxJCwf2HQMw",
    authDomain: "comic-chronicles-2d730.firebaseapp.com",
    projectId: "comic-chronicles-2d730",
    storageBucket: "comic-chronicles-2d730.firebasestorage.app",
    messagingSenderId: "758462508409",
    appId: "1:758462508409:web:17938a59b848796605d3a8",
    measurementId: "G-386JK6SBEM"
};

// 2. INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. GET HTML ELEMENTS
const reviewForm = document.getElementById('reviewForm');
const nameInput = document.getElementById('visitorName');
const messageInput = document.getElementById('visitorMessage');

const testimonialsList = document.getElementById('testimonialsList');
const reviewCount = document.getElementById('reviewCount');
const reviewFeedback = document.getElementById('reviewFeedback');
const reviewPagination = document.getElementById('reviewPagination');

const submitButton = reviewForm?.querySelector('button[type="submit"]');

// 4. PAGINATION SETTINGS
const REVIEWS_PER_PAGE = 5;

let allReviews = [];
let currentPage = 1;

// 5. NOTIFICATION FUNCTION
function showFeedback(message, type) {
    if (!reviewFeedback) return;

    reviewFeedback.textContent = message;

    reviewFeedback.className =
        `mt-3 font-dm text-center ${
            type === 'success' ? 'text-success' : 'text-danger'
        }`;
}

// 6. RENDER REVIEW CARD
function renderReview(doc) {
    const item = doc.data();

    const card = document.createElement('div');
    card.className = 'review-item';

    const name = document.createElement('h5');
    name.className = 'font-archivo fs-6 mb-2 text-comic-red';
    name.textContent = item.name || 'Pengunjung';

    const message = document.createElement('p');
    message.className = 'font-dm mb-2 text-body';
    message.textContent = `"${item.message || ''}"`;

    const date = document.createElement('small');
    date.className = 'font-dm text-muted';

    if (item.createdAt?.toDate) {
        date.textContent = item.createdAt.toDate().toLocaleString(
            'id-ID',
            {
                dateStyle: 'medium',
                timeStyle: 'short'
            }
        );
    } else {
        date.textContent = 'Baru saja';
    }

    card.append(name, message, date);

    return card;
}

// 7. RENDER PAGINATION
function renderPagination(totalPages) {
    if (!reviewPagination) return;

    reviewPagination.innerHTML = '';

    if (totalPages <= 1) {
        return;
    }

    const previousButton = document.createElement('button');
    previousButton.type = 'button';
    previousButton.className = 'review-page-button';
    previousButton.textContent = '← Sebelumnya';
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderReviews();
        }
    });

    const pageInfo = document.createElement('span');
    pageInfo.className = 'review-page-info font-dm';
    pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'review-page-button';
    nextButton.textContent = 'Berikutnya →';
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderReviews();
        }
    });

    reviewPagination.append(
        previousButton,
        pageInfo,
        nextButton
    );
}

// 8. RENDER REVIEWS WITH PAGINATION
function renderReviews() {
    if (!testimonialsList) return;

    testimonialsList.innerHTML = '';

    const totalReviews = allReviews.length;
    const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

    if (reviewCount) {
        reviewCount.textContent = totalReviews;
    }

    if (totalReviews === 0) {
        const emptyMessage = document.createElement('p');

        emptyMessage.className =
            'font-dm text-muted text-center py-3';

        emptyMessage.textContent =
            'Belum ada ulasan. Jadilah yang pertama!';

        testimonialsList.appendChild(emptyMessage);

        if (reviewPagination) {
            reviewPagination.innerHTML = '';
        }

        return;
    }

    // Pastikan halaman tetap valid ketika ada ulasan baru
    currentPage = Math.min(
        Math.max(currentPage, 1),
        totalPages
    );

    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;

    const visibleReviews = allReviews.slice(startIndex, endIndex);

    visibleReviews.forEach((doc) => {
        testimonialsList.appendChild(renderReview(doc));
    });

    renderPagination(totalPages);
}

// 9. FIRESTORE REAL-TIME LISTENER
const reviewsQuery = query(
    collection(db, 'reviews'),
    orderBy('createdAt', 'desc')
);

onSnapshot(
    reviewsQuery,
    (snapshot) => {
        allReviews = snapshot.docs;

        renderReviews();
    },
    (error) => {
        console.error('Gagal mengambil ulasan:', error);

        if (testimonialsList) {
            testimonialsList.textContent =
                'Ulasan belum dapat dimuat. Silakan coba lagi nanti.';
        }
    }
);

// 10. SUBMIT REVIEW (DENGAN ANTI-SPAM COOLDOWN)
const COOLDOWN_SECONDS = 60; // Jeda 60 detik antar pengiriman ulasan

if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Cek apakah pengguna masih dalam masa jeda (Anti-Spam)
        const lastSubmit = localStorage.getItem('lastReviewSubmit');
        if (lastSubmit) {
            const elapsedSeconds = Math.floor((Date.now() - parseInt(lastSubmit, 10)) / 1000);
            if (elapsedSeconds < COOLDOWN_SECONDS) {
                const remaining = COOLDOWN_SECONDS - elapsedSeconds;
                showFeedback(
                    `Mohon tunggu ${remaining} detik sebelum mengirim ulasan lagi.`,
                    'error'
                );
                return;
            }
        }

        // Normalisasi spasi & baris baru berlebih
        const name = nameInput.value.trim().replace(/\s+/g, ' ');
        const message = messageInput.value.trim().replace(/\n{3,}/g, '\n\n');

        // Validasi input
        if (!name || !message) {
            showFeedback('Nama dan ulasan wajib diisi.', 'error');
            return;
        }

        if (name.length > 50 || message.length > 500) {
            showFeedback('Nama maksimal 50 karakter dan ulasan maksimal 500 karakter.', 'error');
            return;
        }

        // Mencegah klik berulang
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span> MENGIRIM...';
        }

        try {
            await addDoc(collection(db, 'reviews'), {
                name: name,
                message: message,
                createdAt: serverTimestamp()
            });

            // Catat waktu pengiriman berhasil untuk cooldown
            localStorage.setItem('lastReviewSubmit', Date.now().toString());

            reviewForm.reset();
            currentPage = 1;

            showFeedback('Terima kasih! Ulasan berhasil dikirim.', 'success');

        } catch (error) {
            console.error('Gagal mengirim ulasan:', error);
            showFeedback('Ulasan gagal dikirim. Silakan coba kembali.', 'error');

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML =
                    'Kirim <i class="bi bi-send-fill ms-1"></i>';
            }
        }
    });
}
