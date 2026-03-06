document.addEventListener('DOMContentLoaded', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const variantParam = (queryParams.get('v') || '').toLowerCase();

    if (variantParam === 'clara') {
        document.body.classList.add('variant-green-clear');
    }

    if (variantParam === 'sobria') {
        document.body.classList.add('variant-green-sober');
    }

    // ---- Acessibilidade: Fonte e Contraste ----
    const btnIncrease = document.getElementById('fontIncrease');
    const btnDecrease = document.getElementById('fontDecrease');
    const btnContrast = document.getElementById('highContrast');
    const htmlElement = document.documentElement;

    let currentFontSize = 100; // Porcentagem

    if (btnIncrease) {
        btnIncrease.addEventListener('click', () => {
            if (currentFontSize < 150) {
                currentFontSize += 10;
                htmlElement.style.fontSize = `${currentFontSize}%`;
            }
        });
    }

    if (btnDecrease) {
        btnDecrease.addEventListener('click', () => {
            if (currentFontSize > 80) {
                currentFontSize -= 10;
                htmlElement.style.fontSize = `${currentFontSize}%`;
            }
        });
    }

    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            // Salvando preferência do usuário (opcional para manter entre páginas)
            const isContrast = document.body.classList.contains('high-contrast');
            localStorage.setItem('iso_high_contrast', isContrast);
        });

        // Carregar preferência salva
        if (localStorage.getItem('iso_high_contrast') === 'true') {
            document.body.classList.add('high-contrast');
        }
    }

    // ---- Menu Hambúrguer (Mobile) — mantido para compatibilidade ----
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('main-menu');

    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            menu.style.display = isExpanded ? 'none' : 'block';
        });
    }

    // ---- Destaque da seção ativa na navegação lateral ----
    const sideNavLinks = document.querySelectorAll('.side-nav-link');
    if (sideNavLinks.length) {
        const normalizePath = (value) => {
            const path = (value || '').trim();
            if (!path) return '/';
            const withoutSlash = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
            return withoutSlash || '/';
        };

        const currentPath = normalizePath(window.location.pathname);

        sideNavLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            const linkPath = normalizePath(href);
            if (linkPath === currentPath) {
                link.classList.add('is-current');
            }
        });
    }

    // ---- Inicializar tradução (i18n) ----
    if (typeof initI18n === 'function') {
        initI18n();
    }
});
