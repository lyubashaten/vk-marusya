<template>
  <div class="film">
    <div class="film__wrap-left">
      <div class="film__wrap-basic-data">
        <span class="film__rating" :style="{ backgroundColor: ratingColor }">
          <img src="../assets/img/svg/star.svg" alt="звездочка" />
          {{ movie.tmdbRating != null ? movie.tmdbRating.toFixed(1) : '—' }}
        </span>
        <span class="film__release film__text">{{ releaseYear }}</span>
        <span class="film__genre film__text">{{ genreText }}</span>
        <span class="film__duration film__text">{{ movie.runtime ? movie.runtime + ' мин' : '—' }}</span>
      </div>
      <div class="film__wrap-main-data">
        <p class="film__title">{{ movie.title || 'Без названия' }}</p>
        <p class="film__descr">{{ movie.plot || 'Описание отсутствует' }}</p>
      </div>
      <div class="film__button">
        <button class="film__trailer btn btn-light" @click="openTrailer">Трейлер</button>
        <TrailerModal ref="trailerModal" />
        <router-link :to="{ name: 'FilmPage', params: { id: movie.id } }">
          <button v-if="showButtons" class="film__about-film btn">О фильме</button>
        </router-link>
        <button class="film__favourite-film btn btn-small" @click="toggleFavorite" :class="{ 'active': isFavorite }"
          :disabled="favoritesStore.isLoading" aria-label="Добавить в избранное">
        </button>
        <button v-if="showButtons" class="film__random-film btn btn-small" @click="fetchRandomMovie">
        </button>
      </div>
    </div>
    <div class="film__wrap-right">
      <img class="film__poster" :src="movie.posterUrl" alt="Постер фильма" width="680px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRandomMovieStore } from '../store/useRandomMovieStore'
import TrailerModal from './TrailerModal.vue'
import { useFavoritesStore } from '../store/useFavoritesStore'
import { useAuthStore } from '../store/useAuthStore'

const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const randomMovieStore = useRandomMovieStore()
const { movie, fetchRandomMovie } = randomMovieStore

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(movie.id)
})

const ratingColor = computed(() => {
  const rating = movie.tmdbRating ?? 0
  if (rating > 8.5) return '#A59400'
  if (rating > 7.4) return '#308E21'
  if (rating > 6.2) return '#777777'
  return '#C82020'
})

const props = defineProps<{ showButtons?: boolean }>()
const showButtons = props.showButtons ?? true

const releaseYear = computed(() => {
  if (!movie.releaseDate) return '—'
  const date = new Date(movie.releaseDate)
  return isNaN(date.getTime()) ? '—' : date.getFullYear()
})

const genreText = computed(() => {
  if (!movie.genres || !movie.genres.length) return '—'
  return movie.genres.join(', ')
})

const trailerModal = ref<InstanceType<typeof TrailerModal> | null>(null)

function openTrailer() {
  if (trailerModal.value && movie.trailerUrl) {
    trailerModal.value.open(movie.trailerUrl, movie.title || 'Трейлер')
  } else {
    console.warn('Трейлер для этого фильма отсутствует')
  }
}

async function toggleFavorite() {
  if (!authStore.isAuthenticated) {
    authStore.openAuthModal()
    return
  }

  try {
    await favoritesStore.toggleFavorite(movie.id)
  } catch (error: any) {
    console.error('Ошибка при добавлении в избранное:', error.message)
  }
}

onMounted(() => {
  fetchRandomMovie()
  if (authStore.isAuthenticated) {
    favoritesStore.fetchFavorites()
  }
})
</script>

<style scoped lang="scss">
@use '../assets/scss/btn.scss';
@use '../assets/scss/random-film.scss';
</style>