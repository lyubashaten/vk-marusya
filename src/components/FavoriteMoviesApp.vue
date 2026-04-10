<template>
    <div class="favorites">
        <div class="favorites__wrap">
            <div v-if="favorite.isLoading" class="preloader"></div>

            <div v-else-if="error" class="error-message">
                {{ error }}
            </div>

            <div v-else-if="favorite.favorites.length === 0" class="empty-message">
                В избранном пока нет фильмов
            </div>

            <ul v-else class="favorites__list">
                <li v-for="movie in favorite.favorites" :key="movie.id" class="favorites__item"
                    @mouseenter="setHoveredMovie(movie.id)" @mouseleave="setHoveredMovie(null)">
                    <router-link :to="{ name: 'FilmPage', params: { id: movie.id } }" class="favorites__poster-link">
                        <img :src="movie.poster || movie.posterUrl" :alt="movie.title" class="favorites__poster-img"
                            @error="handleImageError" />
                    </router-link>

                    <button v-show="hoveredMovieId === movie.id" @click="removeFromFavorites(movie.id)"
                        class="favorites__close-btn" :disabled="favorite.isLoading" title="Удалить из избранного">

                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { onMounted, ref } from 'vue';

const favorite = useFavoritesStore();
const error = ref<string | null>(null);
const hoveredMovieId = ref<number | null>(null);

onMounted(async () => {
    await loadFavorites();
});

const loadFavorites = async () => {
    try {
        error.value = null;
        await favorite.fetchFavorites();
    } catch (err: any) {
        console.error('Ошибка загрузки избранного:', err);
        error.value = err.message || 'Не удалось загрузить избранные фильмы';
    }
};

const removeFromFavorites = async (movieId: number) => {
    try {
        error.value = null;
        await favorite.removeFavorite(movieId);
        hoveredMovieId.value = null;
    } catch (err: any) {
        console.error('Ошибка удаления:', err);
        error.value = err.message || 'Не удалось удалить фильм из избранного';
    }
};

const setHoveredMovie = (movieId: number | null) => {
    hoveredMovieId.value = movieId;
};

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.src = '/placeholder-poster.jpg';
};
</script>
<style scoped lang="scss">
@use '../assets/scss/preloader';
@use '../assets/scss/favorites';
</style>