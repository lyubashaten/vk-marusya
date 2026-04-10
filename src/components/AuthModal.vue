<template>
  <div v-if="authStore.isAuthModalOpen" class="modal-overlay" @click.self="authStore.closeModal()">
    <div class="modal-content">
      <!-- Форма авторизации -->
      <AuthorizationPage v-if="!authStore.isRegistrationMode && !authStore.isSuccessRegistrationOpen"
        @close="authStore.closeModal()" @switch-to-register="authStore.openRegistration()" />

      <!-- Форма регистрации -->
      <RegistrationPage v-else-if="authStore.isRegistrationMode" @close="authStore.closeModal()"
        @switch-to-login="authStore.openAuthModal()" />

      <!-- Экран успешной регистрации -->
      <SuccessfulRegistrationPage v-else-if="authStore.isSuccessRegistrationOpen" @close="authStore.closeModal()"
        @switch-to-login="switchToLoginFromSuccess" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/useAuthStore'
import AuthorizationPage from './AuthorizationPage.vue'
import RegistrationPage from './RegistrationPage.vue'
import SuccessfulRegistrationPage from './SuccessfulRegistrationPage.vue'

const authStore = useAuthStore()

const switchToLoginFromSuccess = () => {
  authStore.closeModal()
  setTimeout(() => {
    authStore.openAuthModal()
  }, 100)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  z-index: 1001;
}

.modal-close:hover {
  color: #000;
}
</style>