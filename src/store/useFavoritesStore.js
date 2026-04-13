// store/useFavoritesStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
const API_BASE = 'https://cinemaguide.skillbox.cc';
export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        favorites: [],
        isLoading: false
    }),
    getters: {
        isFavorite: (state) => (movieId) => {
            return state.favorites.some(fav => fav.id === movieId);
        }
    },
    actions: {
        async addFavorite(movieId) {
            try {
                this.isLoading = true;
                console.log('Adding favorite, movieId:', movieId);
                const formData = new URLSearchParams();
                formData.append('id', movieId.toString());
                const response = await axios.post(`${API_BASE}/favorites`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                console.log('Favorite added successfully:', response.data);
                await this.fetchFavorites();
                return response.data;
            }
            catch (error) {
                console.error('Ошибка добавления в избранное', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    if (error.response.status === 400) {
                        throw new Error('Неверный запрос. Проверьте ID фильма.');
                    }
                    else if (error.response.status === 401) {
                        throw new Error('Необходимо авторизоваться');
                    }
                }
                throw error;
            }
            finally {
                this.isLoading = false;
            }
        },
        async removeFavorite(movieId) {
            try {
                this.isLoading = true;
                const response = await axios.delete(`${API_BASE}/favorites/${movieId}`, { withCredentials: true });
                await this.fetchFavorites();
                return response.data;
            }
            catch (error) {
                console.error('Ошибка удаления из избранного', error);
                throw error;
            }
            finally {
                this.isLoading = false;
            }
        },
        async toggleFavorite(movieId) {
            try {
                if (this.isFavorite(movieId)) {
                    await this.removeFavorite(movieId);
                }
                else {
                    await this.addFavorite(movieId);
                }
            }
            catch (error) {
                console.error('Ошибка переключения избранного', error);
                throw error;
            }
        },
        async fetchFavorites() {
            try {
                this.isLoading = true;
                const response = await axios.get(`${API_BASE}/favorites`, {
                    withCredentials: true
                });
                this.favorites = response.data;
                console.log('Favorites loaded:', this.favorites);
                return this.favorites;
            }
            catch (error) {
                console.error('Ошибка загрузки избранного', error);
                if (error.response?.status === 401) {
                    throw new Error('Необходимо авторизоваться для просмотра избранного');
                }
                throw error;
            }
            finally {
                this.isLoading = false;
            }
        }
    }
});
