import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

interface Movie {
  id: number
  title: string
  posterUrl: string
  genres: string[]
}

export const useGenresStore = defineStore('genres', () => {

  const genres = ref<string[]>([])
  const movieByGenre = ref<Record<string, Movie | null>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchGenres() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('https://cinemaguide.skillbox.cc/movie/genres')
      genres.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке жанров'
    } finally {
      loading.value = false
    }
  }

  async function fetchMovieByGenre(genre: string) {
    try {
      const response = await axios.get('https://cinemaguide.skillbox.cc/movie', {
        params: { genre }
      })
      movieByGenre.value = {
        ...movieByGenre.value,
        [genre]: response.data.length > 0 ? response.data[0] : null
      }
    } catch (err: any) {
      error.value = err.message || `Ошибка при загрузке фильма жанра ${genre}`
    }
  }

  async function fetchAllMoviesByGenres() {
    for (const genre of genres.value) {
      await fetchMovieByGenre(genre)
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
  }
})