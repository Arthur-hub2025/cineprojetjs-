const api = new TMDBApi();

function renderCards(gridId, items, type) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';

    if (!items || items.length === 0) {
        grid.innerHTML = '<p class="grid-empty">Aucun contenu disponible.</p>';
        return;
    }

    items.forEach(item => {
        const card = new MediaCard(item, type);
        grid.appendChild(card.render(api.imgBaseUrl));
    });
}

function setActiveFilter(container, activeBtn) {
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

async function loadTrending(timeWindow = 'day') {
    try {
        const data = await api.getTrending(timeWindow);
        renderCards('grid-tendances', data.results, null);
    } catch (err) {
        const grid = document.getElementById('grid-tendances');
        if (grid) grid.innerHTML = '<p class="grid-empty">Impossible de charger les tendances.</p>';
    }
}

async function loadSeries(category = 'popular') {
    try {
        const data = await api.getSeries(category);
        renderCards('grid-series', data.results, 'tv');
    } catch (err) {
        const grid = document.getElementById('grid-series');
        if (grid) grid.innerHTML = '<p class="grid-empty">Impossible de charger les séries.</p>';
    }
}

async function loadMovies(category = 'popular') {
    try {
        const data = await api.getMovies(category);
        renderCards('grid-films', data.results, 'movie');
    } catch (err) {
        const grid = document.getElementById('grid-films');
        if (grid) grid.innerHTML = '<p class="grid-empty">Impossible de charger les films.</p>';
    }
}

function showSearchSection() {
    document.getElementById('tendances').classList.add('hidden');
    document.getElementById('series').classList.add('hidden');
    document.getElementById('films').classList.add('hidden');
    document.getElementById('recherche').classList.remove('hidden');
}

function hideSearchSection() {
    document.getElementById('tendances').classList.remove('hidden');
    document.getElementById('series').classList.remove('hidden');
    document.getElementById('films').classList.remove('hidden');
    document.getElementById('recherche').classList.add('hidden');
}

async function searchMedia(query) {
    const trimmed = query.trim();

    if (!trimmed) {
        hideSearchSection();
        return;
    }

    showSearchSection();

    const grid = document.getElementById('grid-recherche');
    const emptyMsg = document.getElementById('search-empty');

    grid.innerHTML = '';
    emptyMsg.classList.add('hidden');

    try {
        const data = await api.searchMulti(trimmed);
        const filtered = data.results.filter(item =>
            item.media_type === 'movie' || item.media_type === 'tv'
        );

        if (filtered.length === 0) {
            emptyMsg.classList.remove('hidden');
            return;
        }

        filtered.forEach(item => {
            const card = new MediaCard(item, item.media_type);
            grid.appendChild(card.render(api.imgBaseUrl));
        });
    } catch (err) {
        grid.innerHTML = '<p class="grid-empty">Une erreur est survenue lors de la recherche.</p>';
    }
}

function initTrendingFilters() {
    const container = document.getElementById('filters-tendances');
    if (!container) return;

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveFilter(container, btn);
            loadTrending(btn.dataset.filter);
        });
    });
}

function initSeriesFilters() {
    const container = document.getElementById('filters-series');
    if (!container) return;

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveFilter(container, btn);
            loadSeries(btn.dataset.filter);
        });
    });
}

function initMovieFilters() {
    const container = document.getElementById('filters-films');
    if (!container) return;

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveFilter(container, btn);
            loadMovies(btn.dataset.filter);
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
        if (input.value.trim() === '') {
            hideSearchSection();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadTrending('day');
    loadSeries('popular');
    loadMovies('popular');
    initTrendingFilters();
    initSeriesFilters();
    initMovieFilters();
    initSearch();
});