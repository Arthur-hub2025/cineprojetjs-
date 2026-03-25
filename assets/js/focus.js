const api = new TMDBApi();

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const type = params.get('type');
    return { id, type };
}

document.addEventListener('DOMContentLoaded', () => {
    const { id, type } = getUrlParams();

    if (!id || !type) {
        console.warn('Paramètres URL manquants');
        return;
    }

    console.log(`focus.js chargé — id: ${id}, type: ${type}`);
});
