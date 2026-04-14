import { defineStore } from 'pinia';
import axios from 'axios';
export const useTopMoviesStore = defineStore('topMovies', {
    state: () => ({
        id: 0,
        movies: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchTopMovies() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get('https://cinemaguide.skillbox.cc/movie/top10');
                this.movies = response.data;
            }
            catch (err) {
                this.error = 'Ошибка при загрузке топ-10 фильмов';
                console.error(err);
            }
            finally {
                this.loading = false;
            }
        }
    },
    getters: {
        movieByPosition: (state) => {
            return (position) => {
                if (position < 1 || position > state.movies.length)
                    return null;
                return state.movies[position - 1];
            };
        },
        postersWithPositions: (state) => {
            return state.movies.map((movie, index) => ({
                id: movie.id,
                position: index + 1,
                posterUrl: movie.posterUrl,
                title: movie.title
            }));
        }
    }
});
