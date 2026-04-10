<template>
    <div class="film-info">
        <div v-if="loading" class="loading"></div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="movie">
            <div class="film">
                <div class="film__wrap-left">
                    <div class="film__wrap-basic-data">
                        <span class="film__rating" :style="{ backgroundColor: ratingColor }">
                            <img src="../assets/img/svg/star.svg" alt="звездочка" />
                            {{ movie.tmdbRating != null ? movie.tmdbRating.toFixed(1) : '—' }}
                        </span>
                        <span class="film__release film__text">{{ releaseYear }}</span>
                        <span class="film__genre film__text">{{ genreText }}</span>
                        <span class="film__duration film__text">{{ movie.runtime ? movie.runtime + ' мин' : '—'
                        }}</span>
                    </div>
                    <div class="film__wrap-main-data">
                        <h1 class="film__title">{{ movie.title || 'Без названия' }}</h1>
                        <p class="film__descr">{{ movie.plot || 'Описание отсутствует' }}</p>
                    </div>
                    <div class="film__button">
                        <button class="film__trailer film__trailer-one-film btn btn-light"
                            @click="openTrailer">Трейлер</button>

                        <button class="film__favourite-film btn btn-small" @click="toggleFavorite"
                            :class="{ 'active': isFavorite }" :disabled="favoritesStore.isLoading"
                            aria-label="Добавить в избранное">
                        </button>
                    </div>
                </div>

                <div class="film__wrap-right">
                    <img class="film__poster film__poster-one-film" :src="movie.posterUrl" alt="Постер фильма"
                        width="680px" />
                </div>
            </div>


            <TrailerModal ref="trailerModal" />

            <div class="page-film">
                <h2 class="page-film__title">О фильме</h2>

                <ul class="page-film__list">
                    <li class="page-film__item">
                        <span class="page-film__name ">Язык оригинала</span>
                        <span class="page-film__after page-film__after-1"></span>
                        <span class="page-film__name page-film__value">{{ movie.language || '—' }}</span>
                    </li>
                    <li class="page-film__item">
                        <span class="page-film__name ">Бюджет</span>
                        <span class="page-film__after page-film__after-2"></span>
                        <span class="page-film__name page-film__value">{{ formatCurrency(movie.budget) }}</span>
                    </li>
                    <li class="page-film__item">
                        <span class="page-film__name ">Выручка</span>
                        <span class="page-film__after page-film__after-3"></span>
                        <span class="page-film__name page-film__value">{{ formatCurrency(movie.revenue) }}</span>
                    </li>
                    <li class="page-film__item">
                        <span class="page-film__name ">Режиссёр</span>
                        <span class="page-film__after page-film__after-4"></span>
                        <span class="page-film__name page-film__value">{{ movie.director || '—' }}</span>
                    </li>
                    <li class="page-film__item">
                        <span class="page-film__name ">Продакшен</span>
                        <span class="page-film__after page-film__after-5"></span>
                        <span class="page-film__name page-film__value">{{ movie.production || '—' }}</span>
                    </li>
                    <li class="page-film__item">
                        <span class="page-film__name ">Награды</span>
                        <span class="page-film__after page-film__after-6"></span>
                        <span class="page-film__name page-film__value">{{ movie.awardsSummary || '—' }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useMovieStore } from '../store/useMovieStore'
import { onMounted, watch, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '../store/useFavoritesStore'
import TrailerModal from './TrailerModal.vue'
import { useAuthStore } from '../store/useAuthStore'

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const route = useRoute()
const movieStore = useMovieStore()

const { movie, loading, error } = storeToRefs(movieStore)
const { fetchMovieById } = movieStore

async function toggleFavorite() {
    if (!movie.value || !movie.value.id) {
        console.error('Movie data is not available')
        return
    }

    if (!authStore.isAuthenticated) {
        authStore.openAuthModal()
        return
    }

    try {
        await favoritesStore.toggleFavorite(movie.value.id)
    } catch (error: any) {
        console.error('Ошибка при добавлении в избранное:', error.message)
    }
}

const isFavorite = computed(() => {
    if (!movie.value || !movie.value.id) return false
    return favoritesStore.isFavorite(movie.value.id)
})

const trailerModal = ref<InstanceType<typeof TrailerModal> | null>(null)

const ratingColor = computed(() => {
    if (!movie.value) return '#777777'
    const rating = movie.value.tmdbRating ?? 0
    if (rating > 8.5) return '#A59400'
    if (rating > 7.4) return '#308E21'
    if (rating > 6.2) return '#777777'
    return '#C82020'
})

const releaseYear = computed(() => {
    if (!movie.value?.releaseDate) return '—'
    const date = new Date(movie.value.releaseDate)
    return isNaN(date.getTime()) ? '—' : date.getFullYear()
})

const genreText = computed(() => {
    if (!movie.value?.genres || !movie.value.genres.length) return '—'
    return movie.value.genres.join(', ')
})

function openTrailer() {
    if (trailerModal.value && movie.value?.trailerUrl) {
        trailerModal.value.open(movie.value.trailerUrl, movie.value.title || 'Трейлер')
    } else {
        console.warn('Трейлер для этого фильма отсутствует')
    }
}

function formatCurrency(amount: string | number): string {
    if (!amount || amount === '0' || amount === 0) return '—'

    const numAmount = typeof amount === 'string' ? parseInt(amount) : amount
    if (isNaN(numAmount)) return '—'

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numAmount)
}

function loadMovie() {
    const id = Number(route.params.id)
    if (!isNaN(id) && id > 0) {
        console.log('Loading movie with ID:', id)
        fetchMovieById(id)
    } else {
        console.error('Invalid movie ID:', route.params.id)
    }
}

onMounted(() => {
    loadMovie()
})

watch(() => route.params.id, (newId, oldId) => {
    if (newId !== oldId) {
        console.log('Route ID changed from', oldId, 'to', newId)
        loadMovie()
    }
})
</script>
<style scoped lang="scss">
@use '../assets/scss/btn.scss';
@use '../assets/scss/random-film.scss';
@use '../assets/scss/info-about-film';
</style>