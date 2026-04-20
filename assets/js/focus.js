const api = new TMDBApi();

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const type = params.get('type');
    return { id, type };
}

function showError(message) {
    const main = document.getElementById('focus-main');
    if (!main) return;
    main.innerHTML = `
        <div class="focus-error">
            <p>${message}</p>
            <a href="index.html">← Retour à l'accueil</a>
        </div>
    `;
}

function renderDetails(media) {
    document.title = `${media.title} — CinéSite`;

    const backdrop = document.getElementById('focus-backdrop');
    const backdropUrl = media.getBackdropUrl(api.imgBaseUrl);
    if (backdrop && backdropUrl) {
        backdrop.style.backgroundImage = `url(${backdropUrl})`;
    }

    const posterImg = document.getElementById('focus-poster-img');
    if (posterImg) {
        posterImg.src = media.getPosterUrl(api.imgBaseUrl);
        posterImg.alt = media.title;
        posterImg.addEventListener('error', () => {
            posterImg.src = 'assets/img/default.jpg';
        });
    }

    const titleEl = document.getElementById('focus-title');
    if (titleEl) titleEl.textContent = media.title;

    const taglineEl = document.getElementById('focus-tagline');
    if (taglineEl) {
        taglineEl.textContent = media.tagline || '';
        if (!media.tagline) taglineEl.classList.add('hidden');
    }

    const dateEl = document.getElementById('focus-date');
    if (dateEl) dateEl.textContent = media.formatDate(media.date);

    const runtimeEl = document.getElementById('focus-runtime');
    if (runtimeEl) {
        if (media.type === 'movie' && media.runtime) {
            runtimeEl.textContent = media.formatRuntime(media.runtime);
        } else if (media.type === 'tv' && media.seasons) {
            runtimeEl.textContent = `${media.seasons} saison${media.seasons > 1 ? 's' : ''}`;
        } else {
            runtimeEl.classList.add('hidden');
        }
    }

    const ratingEl = document.getElementById('focus-rating');
    if (ratingEl) ratingEl.textContent = `⭐ ${media.formatRating(media.rating)}`;

    const genresEl = document.getElementById('focus-genres');
    if (genresEl) {
        genresEl.innerHTML = '';
        media.genres.forEach(genre => {
            const tag = document.createElement('span');
            tag.classList.add('genre-tag');
            tag.textContent = genre.name;
            genresEl.appendChild(tag);
        });
    }

    const overviewEl = document.getElementById('focus-overview');
    if (overviewEl) overviewEl.textContent = media.overview;
}

function renderCasting(cast) {
    const grid = document.getElementById('casting-grid');
    if (!grid) return;

    const top8 = cast.slice(0, 8);

    if (top8.length === 0) {
        grid.innerHTML = '<p class="grid-empty">Aucun acteur disponible.</p>';
        return;
    }

    top8.forEach(actor => {
        const photoUrl = actor.profile_path
            ? api.imgBaseUrl + actor.profile_path
            : 'assets/img/default.jpg';

        const card = document.createElement('div');
        card.classList.add('actor-card');
        card.innerHTML = `
            <img src="${photoUrl}" alt="${actor.name}" loading="lazy">
            <div class="actor-card__info">
                <p class="actor-card__name">${actor.name}</p>
                <p class="actor-card__role">${actor.character || ''}</p>
            </div>
        `;

        const img = card.querySelector('img');
        img.addEventListener('error', () => {
            img.src = 'assets/img/default.jpg';
        });

        grid.appendChild(card);
    });
}

async function loadFocusPage(id, type) {
    if (!id || !type) {
        showError('Paramètres manquants dans l\'URL.');
        return;
    }

    if (type !== 'movie' && type !== 'tv') {
        showError('Type de média non reconnu.');
        return;
    }

    try {
        let data;
        let credits;

        if (type === 'movie') {
            data = await api.getMovieDetails(id);
            credits = await api.getMovieCredits(id);
        } else {
            data = await api.getSeriesDetails(id);
            credits = await api.getSeriesCredits(id);
        }

        const media = new MediaDetails(data, type);
        renderDetails(media);
        renderCasting(credits.cast);
    } catch (err) {
        showError('Impossible de charger les détails. Veuillez réessayer.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const { id, type } = getUrlParams();
    loadFocusPage(id, type);
});