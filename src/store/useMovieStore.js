import { defineStore } from 'pinia';
import axios from 'axios';
export const useMovieStore = defineStore('movie', {
    state: () => ({
        movie: null,
        loading: false,
        error: '',
    }),
    actions: {
        async fetchMovieById(id) {
            this.loading = true;
            this.error = null;
            this.movie = null;
            try {
                const response = await axios.get(`https://cinemaguide.skillbox.cc/movie/${id}`);
                this.movie = response.data;
            }
            catch (e) {
                this.error = e.response?.data?.message || 'Ошибка загрузки данных фильма';
            }
            finally {
                this.loading = false;
            }
        },
        clearMovie() {
            this.movie = null;
            this.error = null;
        }
    }
});
