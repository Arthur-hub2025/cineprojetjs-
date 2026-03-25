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

async function testApiConnection() {
    try {
        const data = await api.getTrending('day');
        console.log(`API connectée — ${data.results.length} tendances reçues`);
    } catch (err) {
        console.error('Connexion API échouée :', err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    testApiConnection();
});