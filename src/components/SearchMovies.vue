<template>
    <div class="search-film">
        <ul class="search-film__list">
            <li v-for="movie in searchStore.results" :key="movie.id" class="search-film__item"
                @click="handleMovieClick">
                <router-link :to="{ name: 'FilmPage', params: { id: movie.id } }" class="search-film__link">

                    <img class="search-film__poster" :src="movie.posterUrl" alt="Постер фильма" />
                    <div class="search-film__wrap-info">
                        <div class="search-film__wrap-basic-data">
                            <span class="search-film__rating"
                                :style="{ backgroundColor: getRatingColor(movie.tmdbRating) }">
                                <img src="../assets/img/svg/star.svg" alt="звездочка" />
                                {{ movie.tmdbRating != null ? movie.tmdbRating.toFixed(1) : '—' }}
                            </span>
                            <span class="search-film__release search-film__text">{{ getReleaseYear(movie.releaseDate)
                                }}</span>
                            <span class="search-film__genre search-film__text">{{ getGenreText(movie.genres) }}</span>
                            <span class="search-film__duration search-film__text">{{ movie.runtime ? movie.runtime + ' мин' : '—' }}</span>
                        </div>
                        <h3 class="search-film__title">{{ movie.title || 'Без названия' }}</h3>
                    </div>
                </router-link>
            </li>
        </ul>

        <div v-if="searchStore.loading" class="search-film__loading">
            Загрузка...
        </div>

        <div v-if="searchStore.error" class="search-film__error">
            {{ searchStore.error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '../store/useSearchStore'

const searchStore = useSearchStore()

// Функции для вычисляемых значений
const getRatingColor = (rating: number | null) => {
    if (!rating) return '#777777'
    if (rating > 8.5) return '#A59400'
    if (rating > 7.4) return '#308E21'
    if (rating > 6.2) return '#777777'
    return '#C82020'
}

const getReleaseYear = (releaseDate: string) => {
    if (!releaseDate) return '—'
    const date = new Date(releaseDate)
    return isNaN(date.getTime()) ? '—' : date.getFullYear()
}

const getGenreText = (genres: string[]) => {
    if (!genres || !genres.length) return '—'
    return genres.join(', ')
}

const handleMovieClick = () => {
    searchStore.closeDropdown()
    searchStore.clearResults()
}
</script>

<style scoped lang="scss">
@use '../assets/scss/search-movie.scss';
</style>