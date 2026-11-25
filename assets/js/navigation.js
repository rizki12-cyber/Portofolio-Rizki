/* ==========================================================
   COMIC CHRONICLES — NAVIGATION, SCROLL & CHAPTER TRACKER
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Sesuaikan dengan kelas navbar minimalis yang baru
    const navbar = document.querySelector('.comic-navbar-minimal');
    const readingProgress = document.getElementById('reading-progress');
    const backToTopBtn = document.getElementById('backToTop');
    const currentChapterTag = document.getElementById('currentChapter');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.comic-nav-link');

    let lastScrollY = window.scrollY;

    // Sticky Navbar, Reading Progress & Auto-Hide Handler
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Progress Bar
        if (readingProgress) readingProgress.style.width = `${scrollPercent}%`;

        // Back to Top Button
        if (backToTopBtn) {
            backToTopBtn.style.display = scrollTop > 400 ? 'flex' : 'none';
        }

        // Auto-Hide Navbar Logika
        const navbarCollapse = document.getElementById('navbarNav');
        const isMenuOpen = navbarCollapse && navbarCollapse.classList.contains('show');

        if (navbar && !isMenuOpen) {
            if (scrollTop > lastScrollY && scrollTop > 100) {
                // Scroll ke bawah -> Sembunyikan navbar
                navbar.classList.add('navbar-hidden');
            } else if (scrollTop < lastScrollY) {
                // Scroll ke atas -> Munculkan navbar
                navbar.classList.remove('navbar-hidden');
            }
        }
        lastScrollY = scrollTop;

        // Active Chapter & Section Observer
        let currentSectionId = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollTop >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Update Active Nav Link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Update Chapter Tag di Pojok (Floating Chapter Indicator)
        if (currentChapterTag) {
    const chapterMap = {
        'home': 'EDISI #001 — BERANDA',
        'about': 'BAB 02 — TENTANG',
        'origin': 'BAB 03 — PENDIDIKAN',
        'experience': 'BAB 04 — PENGALAMAN',
        'skills': 'BAB 05 — KEAHLIAN',
        'projects': 'BAB 06 — PROYEK',
        'behind-the-code': 'BAB 07 — BEHIND THE CODE',
        'developer-zone': 'BAB 08 — DEVELOPER ZONE',
        'achievement': 'BAB 09 — ACHIEVEMENT',
        'certificates': 'BAB 10 — SERTIFIKAT',
        'roadmap': 'BAB 11 — ROADMAP',
        'reviews': 'BAB 12 — SUARA PEMBACA',
        'contact': 'BAB 13 — KONTAK / THE END'
    };
    currentChapterTag.textContent = chapterMap[currentSectionId] || 'EDISI #001';
}
    }, { passive: true });

    // Back to Top Click Action
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth Scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Tutup menu mobile jika terbuka
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });
});