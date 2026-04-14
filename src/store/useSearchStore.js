import { defineStore } from 'pinia';
import axios from 'axios';
export const useSearchStore = defineStore('search', {
    state: () => ({
        query: '',
        results: [],
        loading: false,
        error: null,
        isOpen: false
    }),
    actions: {
        async searchMovies(searchQuery) {
            if (!searchQuery.trim()) {
                this.results = [];
                this.isOpen = false;
                return;
            }
            this.query = searchQuery;
            this.loading = true;
            this.error = null;
            this.isOpen = true;
            try {
                const response = await axios.get('https://cinemaguide.skillbox.cc/movie');
                const allMovies = response.data;
                const filteredMovies = allMovies.filter((movie) => {
                    const searchTerm = searchQuery.toLowerCase().trim();
                    const movieTitle = movie.title?.toLowerCase() || '';
                    return movieTitle.includes(searchTerm);
                });
                this.results = filteredMovies.slice(0, 5);
                console.log('Search results:', this.results);
            }
            catch (err) {
                this.error = err.response?.data?.message || 'Ошибка при поиске фильмов';
                console.error('Search error:', err);
            }
            finally {
                this.loading = false;
            }
        },
        clearResults() {
            this.results = [];
            this.query = '';
            this.isOpen = false;
        },
        closeDropdown() {
            this.isOpen = false;
        },
        openDropdown() {
            if (this.query.trim() && this.results.length > 0) {
                this.isOpen = true;
            }
        }
    },
    getters: {
        hasResults: (state) => state.results.length > 0,
        isEmptyQuery: (state) => !state.query.trim()
    }
});
