<template>
  <div class="header">
    <RouterLink to="/">
      <img class="header__logo" src="../assets/img/logo-set/marusya.svg" alt="Логотип сайта" />
    </RouterLink>

    <div class="header__info-wrap">

      <div class="header__wrap-links ">
        <RouterLink to="/">
          <span class=" header__link header__link--main">Главная</span>
        </RouterLink>
        <RouterLink to="/ganry">
          <span class="header__link header__link--ganre">Жанры</span>
          <img class="header__ganre" src="../assets/img/svg/ganre.svg" alt="Иконка жанров" aria-label="Жанры">
        </RouterLink>
        <SearchInput />
      </div>

      <div class="header__auth">
        <div v-if="authStore.isAuthenticated" class="user-info">
          <button class="header__btn" @click="goToPersonalAccount">
            <span class="header__link">{{ authStore.user?.surname }}</span>
            <img class="header__account" src="../assets/img/svg/account-logo.svg" alt="Иконка входа">
          </button>
        </div>

        <button v-else class="header__btn" @click="authStore.openAuthModal()">
          <img class="header__account" src="../assets/img/svg/account-logo.svg" alt="Иконка входа">
          <span class="header__link">Войти</span>

        </button>
      </div>
    </div>
  </div>

  <AuthModal v-if="authStore.isAuthModalOpen" />
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SearchInput from './SearchInput.vue'
import { useAuthStore } from '../store/useAuthStore'
import AuthModal from './AuthModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter();

const goToPersonalAccount = () => {
  router.push('/profile');
};
const authStore = useAuthStore()

function openAuth() {
  authStore.openAuthModal()
}

</script>

<style lang="scss" scoped>
@use '../assets/scss/header';
</style>