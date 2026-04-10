<template>
  <div class="authorization">
    <div class="authorization__wrap">
      <div class="authorization__info">
        <button class="authorization__btn-close btn-close" @click="closeModal" type="button"></button>
        <img class="authorization__logo" src="../assets/img/logo-set/marusya-black.svg" alt="Логотип" />
        <h1 class="authorization__title">Регистрация завершена!</h1>
        <div class="authorization__descr">
          Используйте вашу электронную почту для входа
        </div>
        <div class="authorization__wrap-btn">
          <button type="button" class="authorization__btn-successful btn btn-light" @click="switchToLogin">
            Войти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/useAuthStore'

const authStore = useAuthStore()

const switchToLogin = () => {
  authStore.closeModal()
  authStore.openAuthModal()
}

const closeModal = () => {
  authStore.closeModal()
}
</script>

<style scoped lang="scss">
@use '../assets/scss/btn';
@use '../assets/scss/authorization';
@use '../assets/scss/error';
</style>