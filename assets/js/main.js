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

document.addEventListener('DOMContentLoaded', () => {
    loadTrending('day');
    loadSeries('popular');
    loadMovies('popular');
    initTrendingFilters();
    initSeriesFilters();
    initMovieFilters();
});
