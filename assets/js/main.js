const api = new TMDBApi();

function showSkeletons(gridId, count = 8) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < count; i++) {
        grid.innerHTML += `
            <div class="skeleton-card">
                <div class="skeleton-poster"></div>
                <div class="skeleton-info">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>
        `;
    }
}

function renderCards(gridId, items, type) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';

    if (!items || items.length === 0) {
        grid.innerHTML = '<p class="grid-empty">Aucun contenu disponible.</p>';
        return;
    }

    items.forEach((item, index) => {
        const card = new MediaCard(item, type);
        const el = card.render(api.imgBaseUrl);
        el.style.animationDelay = `${index * 0.04}s`;
        grid.appendChild(el);
    });
}

function setActiveFilter(container, activeBtn) {
    container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

async function loadSection(gridId, fetchFn, type, errorMsg) {
    showSkeletons(gridId);
    try {
        const data = await fetchFn();
        renderCards(gridId, data.results, type);
    } catch {
        const grid = document.getElementById(gridId);
        if (grid) grid.innerHTML = `<p class="grid-empty">${errorMsg}</p>`;
    }
}

function loadTrending(timeWindow = 'day') {
    return loadSection('grid-tendances', () => api.getTrending(timeWindow), null, 'Impossible de charger les tendances.');
}

function loadSeries(category = 'popular') {
    return loadSection('grid-series', () => api.getSeries(category), 'tv', 'Impossible de charger les séries.');
}

function loadMovies(category = 'popular') {
    return loadSection('grid-films', () => api.getMovies(category), 'movie', 'Impossible de charger les films.');
}

function toggleSearch(visible) {
    ['tendances', 'series', 'films'].forEach(id => {
        document.getElementById(id).classList.toggle('hidden', visible);
    });
    document.getElementById('recherche').classList.toggle('hidden', !visible);
}

async function searchMedia(query) {
    const trimmed = query.trim();

    if (!trimmed) {
        toggleSearch(false);
        return;
    }

    toggleSearch(true);

    const grid = document.getElementById('grid-recherche');
    const emptyMsg = document.getElementById('search-empty');

    showSkeletons('grid-recherche');
    emptyMsg.classList.add('hidden');

    try {
        const data = await api.searchMulti(trimmed);
        const filtered = data.results.filter(item =>
            item.media_type === 'movie' || item.media_type === 'tv'
        );

        if (filtered.length === 0) {
            grid.innerHTML = '';
            emptyMsg.classList.remove('hidden');
            return;
        }

        renderCards('grid-recherche', filtered, null);
    } catch {
        grid.innerHTML = '<p class="grid-empty">Une erreur est survenue lors de la recherche.</p>';
    }
}

function initFilters(containerId, loadFn) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveFilter(container, btn);
            loadFn(btn.dataset.filter);
        });
    });
}

function initSearch() {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    if (!form || !input) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        searchMedia(input.value);
    });

    input.addEventListener('input', () => {
        if (input.value.trim() === '') toggleSearch(false);
    });
}

function initScrollEffects() {
    const progress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (progress && total > 0) progress.style.width = `${(scrolled / total) * 100}%`;
        if (backToTop) backToTop.classList.toggle('visible', scrolled > 400);
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadTrending('day');
    loadSeries('popular');
    loadMovies('popular');
    initFilters('filters-tendances', loadTrending);
    initFilters('filters-series', loadSeries);
    initFilters('filters-films', loadMovies);
    initSearch();
    initScrollEffects();
});