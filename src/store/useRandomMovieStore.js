import { defineStore } from 'pinia';
import axios from 'axios';
export const useRandomMovieStore = defineStore('randomMovie', {
    state: () => ({
        movie: {
            id: 0,
            title: '',
            originalTitle: '',
            language: '',
            releaseYear: 0,
            releaseDate: '',
            genres: [],
            plot: '',
            runtime: 0,
            budget: '',
            revenue: '',
            homepage: '',
            status: '',
            posterUrl: '',
            backdropUrl: '',
            trailerUrl: '',
            trailerYoutubeId: '',
            tmdbRating: null,
            searchL: '',
            keywords: [],
            countriesOfOrigin: [],
            languages: [],
            cast: [],
            director: '',
            production: '',
            awardsSummary: '',
        },
        loading: false,
        error: null
    }),
    actions: {
        async fetchRandomMovie() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get('https://cinemaguide.skillbox.cc/movie/random');
                const data = response.data;
                this.movie.id = data.id;
                this.movie.tmdbRating = data.tmdbRating;
                this.movie.posterUrl = data.posterUrl;
                this.movie.runtime = data.runtime;
                this.movie.releaseDate = data.releaseDate;
                this.movie.genres = data.genres;
                this.movie.plot = data.plot;
                this.movie.title = data.title;
                this.movie.trailerUrl = data.trailerUrl;
                this.movie.budget = data.budget;
                this.movie.director = data.director;
                this.movie.production = data.production;
                this.movie.revenue = data.revenue;
            }
            catch (err) {
                this.error = 'Ошибка при загрузке фильма';
                console.error(err);
            }
            finally {
                this.loading = false;
            }
        }
    }
});
