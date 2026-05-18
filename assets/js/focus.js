const api = new TMDBApi();

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        type: params.get('type')
    };
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

function setEl(id, fn) {
    const el = document.getElementById(id);
    if (el) fn(el);
}

function renderDetails(media) {
    document.title = `${media.title} — CinéSite`;

    const backdropUrl = media.getBackdropUrl(api.imgBaseUrl);
    setEl('focus-backdrop', el => {
        if (backdropUrl) el.style.backgroundImage = `url(${backdropUrl})`;
    });

    setEl('focus-poster-img', el => {
        el.src = media.getPosterUrl(api.imgBaseUrl);
        el.alt = media.title;
        el.addEventListener('error', () => { el.src = 'assets/img/default.jpg'; });
    });

    setEl('focus-title', el => el.textContent = media.title);

    setEl('focus-tagline', el => {
        el.textContent = media.tagline || '';
        if (!media.tagline) el.classList.add('hidden');
    });

    setEl('focus-date', el => el.textContent = media.formatDate(media.date));

    setEl('focus-runtime', el => {
        if (media.type === 'movie' && media.runtime) {
            el.textContent = media.formatRuntime(media.runtime);
        } else if (media.type === 'tv' && media.seasons) {
            el.textContent = `${media.seasons} saison${media.seasons > 1 ? 's' : ''}`;
        } else {
            el.classList.add('hidden');
        }
    });

    setEl('focus-rating', el => el.textContent = `⭐ ${media.formatRating(media.rating)}`);

    setEl('focus-genres', el => {
        el.innerHTML = '';
        media.genres.forEach(genre => {
            const tag = document.createElement('span');
            tag.classList.add('genre-tag');
            tag.textContent = genre.name;
            el.appendChild(tag);
        });
    });

    setEl('focus-overview', el => el.textContent = media.overview);
}

function renderCasting(cast) {
    const grid = document.getElementById('casting-grid');
    if (!grid) return;

    const top8 = cast.slice(0, 8);

    if (top8.length === 0) {
        grid.innerHTML = '<p class="grid-empty">Aucun acteur disponible.</p>';
        return;
    }

    top8.forEach((actor, index) => {
        const photoUrl = actor.profile_path
            ? api.imgBaseUrl + actor.profile_path
            : 'assets/img/default.jpg';

        const card = document.createElement('div');
        card.classList.add('actor-card');
        card.style.animationDelay = `${index * 0.04}s`;
        card.innerHTML = `
            <img src="${photoUrl}" alt="${actor.name}" loading="lazy">
            <div class="actor-card__info">
                <p class="actor-card__name">${actor.name}</p>
                <p class="actor-card__role">${actor.character || ''}</p>
            </div>
        `;

        const img = card.querySelector('img');
        img.addEventListener('error', () => { img.src = 'assets/img/default.jpg'; });

        grid.appendChild(card);
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
        const isMovie = type === 'movie';
        const data = await (isMovie ? api.getMovieDetails(id) : api.getSeriesDetails(id));
        const credits = await (isMovie ? api.getMovieCredits(id) : api.getSeriesCredits(id));

        const media = new MediaDetails(data, type);
        renderDetails(media);
        renderCasting(credits.cast);
    } catch {
        showError('Impossible de charger les détails. Veuillez réessayer.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const { id, type } = getUrlParams();
    loadFocusPage(id, type);
    initScrollEffects();
});