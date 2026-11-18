/* ==========================================================
   COMIC CHRONICLES — DARK / LIGHT MODE LOGIC
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeToggleMobileBtn = document.getElementById('themeToggleMobile');
    
    const currentTheme = localStorage.getItem('comic_theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);

    function toggleTheme() {
        const activeTheme = htmlElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('comic_theme', newTheme);
        updateThemeIcons(newTheme);
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

    function updateThemeIcons(theme) {
        const iconClass = theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill';
        [themeToggleBtn, themeToggleMobileBtn].forEach(btn => {
            if (btn) {
                const icon = btn.querySelector('i');
                if (icon) icon.className = `bi ${iconClass}`;
            }
        });
    }
});