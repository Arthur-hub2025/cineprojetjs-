class MediaDetails {
    constructor(data, type) {
        this.id = data.id;
        this.type = type;
        this.title = data.title || data.name || 'Titre inconnu';
        this.overview = data.overview || 'Aucun résumé disponible.';
        this.poster = data.poster_path;
        this.backdrop = data.backdrop_path;
        this.rating = data.vote_average;
        this.date = data.release_date || data.first_air_date || '';
        this.genres = data.genres || [];
        this.runtime = data.runtime || null;
        this.seasons = data.number_of_seasons || null;
        this.episodes = data.number_of_episodes || null;
        this.status = data.status || null;
        this.tagline = data.tagline || null;
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

    formatRuntime(minutes) {
        if (!minutes) return null;
        const h = Math.floor(minutes / 60);
        const min = minutes % 60;
        if (h === 0) return `${min} min`;
        return `${h}h ${min}min`;
    }

    getGenreList() {
        if (!this.genres.length) return 'Genres inconnus';
        return this.genres.map(g => g.name).join(', ');
    }

    getPosterUrl(imgBaseUrl) {
        if (!this.poster) return 'assets/img/default.jpg';
        return imgBaseUrl + this.poster;
    }

    getBackdropUrl(imgBaseUrl) {
        if (!this.backdrop) return null;
        return 'https://image.tmdb.org/t/p/original' + this.backdrop;
    }
}