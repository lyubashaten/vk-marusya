import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, computed } from 'vue';
export const useMoviesByGenreStore = defineStore('moviesByGenre', () => {
    const allMovies = ref([]); // все фильмы жанра
    const visibleMovies = ref([]); // фильмы, которые показываем на странице
    const loading = ref(false);
    const error = ref(null);
    const pageSize = 10;
    const currentPage = ref(1);
    const currentGenre = ref(null);
    async function fetchMoviesByGenre(genre) {
        if (loading.value)
            return;
        loading.value = true;
        error.value = null;
        currentGenre.value = genre;
        currentPage.value = 1;
        visibleMovies.value = [];
        try {
            const response = await axios.get('https://cinemaguide.skillbox.cc/movie', {
                params: { genre }
            });
            allMovies.value = response.data;
            visibleMovies.value = allMovies.value.slice(0, pageSize);
        }
        catch (err) {
            error.value = err.message || 'Ошибка при загрузке фильмов';
        }
        finally {
            loading.value = false;
        }
    }
    function loadMore() {
        if (loading.value)
            return;
        const nextPage = currentPage.value + 1;
        const start = (nextPage - 1) * pageSize;
        const end = start + pageSize;
        visibleMovies.value.push(...allMovies.value.slice(start, end));
        currentPage.value = nextPage;
    }
    const hasMore = computed(() => visibleMovies.value.length < allMovies.value.length);
    return {
        allMovies,
        visibleMovies,
        loading,
        error,
        currentGenre,
        fetchMoviesByGenre,
        loadMore,
        hasMore
    };
});
