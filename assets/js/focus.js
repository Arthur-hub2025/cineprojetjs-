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
        if (type === 'movie') {
            data = await api.getMovieDetails(id);
        } else {
            data = await api.getSeriesDetails(id);
        }

        const media = new MediaDetails(data, type);
        console.log(`Détails chargés : ${media.title}`);
    } catch (err) {
        showError('Impossible de charger les détails. Veuillez réessayer.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const { id, type } = getUrlParams();
    loadFocusPage(id, type);
});