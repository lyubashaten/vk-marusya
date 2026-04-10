<template>
  <div class="shoosen-ganre">
    <div class="shoosen-ganre__wrapper">
      <div class="shoosen-ganre__wrap">
        <button class="shoosen-ganre__btn-close" @click="goBack">
        </button>
        <h1 class="shoosen-ganre__title">{{ genre }}</h1>
      </div>
      <ul class="shoosen-ganre__list">
        <li v-for="movie in visibleMovies" :key="movie.id" class="shoosen-ganre__item">
          <router-link :to="{ name: 'FilmPage', params: { id: movie.id } }">
            <img class="shoosen-ganre__img" :src="movie.posterUrl" :alt="movie.title" />
          </router-link>
        </li>
      </ul>
    </div>
    <button v-if="hasMore && !loading" class="shoosen-ganre__btn-open btn btn-light" @click="loadMore">
      Показать ещё
    </button>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMoviesByGenreStore } from '../store/useMoviesByGenreStore'
import { storeToRefs } from 'pinia'

const moviesStore = useMoviesByGenreStore()

const { visibleMovies, allMovies, loading, error, } = storeToRefs(moviesStore)

const hasMore = computed(() => visibleMovies.value.length < allMovies.value.length)

const route = useRoute()
const router = useRouter()
const genre = route.params.genre as string

function loadMore() {
  moviesStore.loadMore()
}

function goBack() {
  router.back()
}

onMounted(() => {
  moviesStore.fetchMoviesByGenre(genre)
})

watch(() => route.params.genre, (newGenre) => {
  if (typeof newGenre === 'string') {
    moviesStore.fetchMoviesByGenre(newGenre)
  }
})
</script>
<style scoped lang="scss">
@use '../assets/scss/btn';
@use '../assets/scss/shoosen-ganre'
</style>
