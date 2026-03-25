class TMDBApi {
    constructor() {
        this.apiKey = 'VOTRE_CLE_API';
        this.baseUrl = 'https://api.themoviedb.org/3';
        this.imgBaseUrl = 'https://image.tmdb.org/t/p/w500';
        this.language = 'fr-FR';
    }

    async fetch(endpoint, params = {}) {
        const url = new URL(this.baseUrl + endpoint);
        url.searchParams.set('api_key', this.apiKey);
        url.searchParams.set('language', this.language);

        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Erreur API : ${response.status}`);
        }

        return response.json();
    }

    getImageUrl(path) {
        if (!path) return 'assets/img/default.jpg';
        return this.imgBaseUrl + path;
    }

    getTrending(timeWindow = 'day') {
        return this.fetch(`/trending/all/${timeWindow}`);
    }

    getMovies(category = 'popular') {
        return this.fetch(`/movie/${category}`);
    }

    getSeries(category = 'popular') {
        return this.fetch(`/tv/${category}`);
    }

    getMovieDetails(id) {
        return this.fetch(`/movie/${id}`);
    }

    getSeriesDetails(id) {
        return this.fetch(`/tv/${id}`);
    }

    getMovieCredits(id) {
        return this.fetch(`/movie/${id}/credits`);
    }

    getSeriesCredits(id) {
        return this.fetch(`/tv/${id}/credits`);
    }

    searchMulti(query) {
        return this.fetch('/search/multi', { query });
    }
}