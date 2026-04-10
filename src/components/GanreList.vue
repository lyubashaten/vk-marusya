<template>
  <div class="ganre">
    <h2 class="ganre__heading">Жанры фильмов</h2>
    <div class="preloader" v-if="loading"></div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <ul v-else class="ganre__list">
      <li v-for="genre in genres" :key="genre" class="ganre__item">
        <router-link v-if="movieByGenre[genre]" :to="{ name: 'FilmsByGenre', params: { genre } }" class="ganre__link">
          <h3 class="ganre__title">{{ genre }}</h3>
          <div class="ganre__wrap">
            <div class="movie">
              <img class="ganre__img" :src="movieByGenre[genre].posterUrl" :alt="movieByGenre[genre].title" />
            </div>
          </div>
        </router-link>
        <div v-else class="no-movie">Фильм не найден</div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGenresStore } from '../store/useGanreMovieStore'

const genresStore = useGenresStore()
const { genres, movieByGenre, loading, error } = storeToRefs(genresStore)
const { fetchGenres, fetchAllMoviesByGenres } = genresStore

onMounted(async () => {
  await fetchGenres()
  await fetchAllMoviesByGenres()
})
</script>
<style scoped lang="scss">
@use '../assets/scss/preloader';
@use '../assets/scss/ganre';
</style>