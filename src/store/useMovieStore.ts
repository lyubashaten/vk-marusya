import { defineStore } from 'pinia'
import axios from 'axios'
import { Movie } from '@/types/Movie.js'

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movie: null as Movie | null,
    loading: false,
    error: '' as string | null,
  }),
  actions: {
    async fetchMovieById(id: number) {
      this.loading = true
      this.error = null
      this.movie = null
      try {
        const response = await axios.get(`https://cinemaguide.skillbox.cc/movie/${id}`)
        this.movie = response.data
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Ошибка загрузки данных фильма'
      } finally {
        this.loading = false
      }
    },
    clearMovie() {
      this.movie = null
      this.error = null
    }
  }
})