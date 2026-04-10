import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'

interface Movie {
  id: number
  title: string
  posterUrl: string
  genres: string[]
}

export const useMoviesByGenreStore = defineStore('moviesByGenre', () => {
  const allMovies = ref<Movie[]>([]) // все фильмы жанра
  const visibleMovies = ref<Movie[]>([]) // фильмы, которые показываем на странице
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pageSize = 10
  const currentPage = ref(1)
  const currentGenre = ref<string | null>(null)

  async function fetchMoviesByGenre(genre: string) {
    if (loading.value) return
    loading.value = true
    error.value = null
    currentGenre.value = genre
    currentPage.value = 1
    visibleMovies.value = []
    try {
      const response = await axios.get('https://cinemaguide.skillbox.cc/movie', {
        params: { genre }
      })
      allMovies.value = response.data
      visibleMovies.value = allMovies.value.slice(0, pageSize)
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке фильмов'
    } finally {
      loading.value = false
    }
  }

  function loadMore() {
    if (loading.value) return
    const nextPage = currentPage.value + 1
    const start = (nextPage - 1) * pageSize
    const end = start + pageSize
    visibleMovies.value.push(...allMovies.value.slice(start, end))
    currentPage.value = nextPage
  }

  const hasMore = computed(() => visibleMovies.value.length < allMovies.value.length)

  return {
    allMovies,
    visibleMovies,
    loading,
    error,
    currentGenre,
    fetchMoviesByGenre,
    loadMore,
    hasMore
  }
})