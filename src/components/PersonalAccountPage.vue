<template>
    <div class="personal-account">
        <h1 class="personal-account__title">Мой аккаунт</h1>
        <div class="personal-account__links">
            <a href="#" @click.prevent="activeTab = 'favorites'" :class="['personal-account__link', 'personal-account__link--favorites',
                { 'personal-account__link--active': activeTab === 'favorites' }]">
                <span class="personal-account__links-favorites-big">Избранные фильмы</span>
                <span class="personal-account__links-favorites">Избранное</span>
            </a>
            <a href="#" @click.prevent="activeTab = 'settings'" :class="['personal-account__link', 'personal-account__link--settings',
                { 'personal-account__link--active': activeTab === 'settings' }]">
                <span class="personal-account__links-settings-big">Настройка аккаунта</span>
                <span class="personal-account__links-settings">Настройки</span>
            </a>
        </div>

        <div class="personal-account__content">
            <FavoriteMoviesApp v-if="activeTab === 'favorites'" />
            <SettingsPage v-if="activeTab === 'settings'" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FavoriteMoviesApp from './FavoriteMoviesApp.vue';
import SettingsPage from './SettingsPage.vue';

const activeTab = ref<'favorites' | 'settings'>('favorites');
</script>


<style scoped lang="scss">
@use '../assets/scss/personal-account';
</style>