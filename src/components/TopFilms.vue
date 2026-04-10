<template>
    <div class="top">
        <h2 class="top__title">Топ 10 фильмов</h2>
        <div class="top__list">
            <div v-for="movie in topMoviesStore.postersWithPositions" :key="movie.position" class="top__item">
                <div class="top__position">{{ movie.position }}</div>
                <router-link :to="{ name: 'FilmPage', params: { id: movie.id } }">
                    <img :src="movie.posterUrl" :alt="movie.title" class="top__poster" width="150" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTopMoviesStore } from '../store/useTopMovieStore'
import { onMounted } from 'vue'

const topMoviesStore = useTopMoviesStore()

onMounted(() => {
    topMoviesStore.fetchTopMovies()
})
</script>

<style lang="scss" scoped>
@use '../assets/scss/top-films'
</style>