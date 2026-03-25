class MediaCard {
    constructor(data, type) {
        this.id = data.id;
        this.type = type || data.media_type || 'movie';
        this.title = data.title || data.name || 'Titre inconnu';
        this.date = data.release_date || data.first_air_date || '';
        this.poster = data.poster_path;
        this.rating = data.vote_average;
    }

    formatDate(dateStr) {
        if (!dateStr) return 'Date inconnue';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    formatRating(rating) {
        if (!rating) return 'N/A';
        return parseFloat(rating).toFixed(1);
    }

    render(imgBaseUrl) {
        const posterUrl = this.poster
            ? imgBaseUrl + this.poster
            : 'assets/img/default.jpg';

        const article = document.createElement('article');
        article.classList.add('media-card');

        article.innerHTML = `
            <a href="focus.html?id=${this.id}&type=${this.type}" class="media-card__link">
                <div class="media-card__poster">
                    <img src="${posterUrl}" alt="${this.title}" loading="lazy">
                    <span class="media-card__badge">${this.formatRating(this.rating)}</span>
                </div>
                <div class="media-card__info">
                    <h3 class="media-card__title">${this.title}</h3>
                    <p class="media-card__date">${this.formatDate(this.date)}</p>
                </div>
            </a>
        `;

        const img = article.querySelector('img');
        img.addEventListener('error', () => {
            img.src = 'assets/img/default.jpg';
        });

        return article;
    }
}