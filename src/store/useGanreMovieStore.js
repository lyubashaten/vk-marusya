import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
export const useGenresStore = defineStore('genres', () => {
    const genres = ref([]);
    const movieByGenre = ref({});
    const loading = ref(false);
    const error = ref(null);
    async function fetchGenres() {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get('https://cinemaguide.skillbox.cc/movie/genres');
            genres.value = response.data;
        }
        catch (err) {
            error.value = err.message || 'Ошибка при загрузке жанров';
        }
        finally {
            loading.value = false;
        }
    }
    async function fetchMovieByGenre(genre) {
        try {
            const response = await axios.get('https://cinemaguide.skillbox.cc/movie', {
                params: { genre }
            });
            movieByGenre.value = {
                ...movieByGenre.value,
                [genre]: response.data.length > 0 ? response.data[0] : null
            };
        }
        catch (err) {
            error.value = err.message || `Ошибка при загрузке фильма жанра ${genre}`;
        }
    }
    async function fetchAllMoviesByGenres() {
        for (const genre of genres.value) {
            await fetchMovieByGenre(genre);
        }
    }
    return {
        genres,
        movieByGenre,
        loading,
        error,
        fetchGenres,
        fetchMovieByGenre,
        fetchAllMoviesByGenres
    };
});
