<template>
  <div class="authorization">
    <div class="authorization__wrap">
      <div class="authorization__info">

        <button class="authorization__btn-close btn-close" @click="emit('close')" type="button"></button>

        <img class="authorization__logo" src="../assets/img/logo-set/marusya-black.svg" alt="Логотип">

        <form class="authorization__form" @submit.prevent="onSubmit">

          <div class="authorization__wrap-input">
            <div class="authorization__icon authorization__icon--letter" :class="{ 'error icon-error': errors.email }">
              <input type="email" class="authorization__input" required placeholder="Электронная почта" v-model="email"
                @blur="validateField('email')" @input="clearError('email')">
            </div>

            <div class="authorization__icon authorization__icon--key" :class="{ 'error icon-error': errors.password }">
              <input type="password" class="authorization__input" required placeholder="Пароль" v-model="password"
                @blur="validateField('password')" @input="clearError('password')">
            </div>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
          </div>

          <div class="authorization__wrap-btn">
            <button type="submit" class="authorization__btn-log btn btn-light" :disabled="isLoading">
              {{ isLoading ? 'Вход...' : 'Войти' }}
            </button>
            <button type="button" class="authorization__btn" @click="$emit('switchToRegister')">
              Регистрация
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '../store/useAuthStore'

const emit = defineEmits(['close', 'switchToRegister'])

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const errors = reactive({
  email: false,
  password: false
})

const authStore = useAuthStore()

function clearError(field: string) {
  errors[field as keyof typeof errors] = false
  errorMessage.value = ''
}

function validateField(field: string) {
  if (field === 'email') {
    errors.email = !email.value || !isValidEmail(email.value)
  } else if (field === 'password') {
    errors.password = !password.value || password.value.length < 6
  }
}

// Валидация email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateForm() {

  let isValid = true

  // Валидация email
  if (!email.value) {
    errors.email = true
    isValid = false
  } else if (!isValidEmail(email.value)) {
    errors.email = true
    isValid = false
  }

  // Валидация пароля
  if (!password.value) {
    errors.password = true
    isValid = false
  } else if (password.value.length < 6) {
    errors.password = true
    isValid = false
  }

  return isValid;
}

async function onSubmit() {
  errorMessage.value = ''

  if (!validateForm()) {
    errorMessage.value = 'Заполните все обязательные поля корректно'
    return
  }

  isLoading.value = true

  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    emit('close')
  } catch (e: any) {
    errorMessage.value = e.message || 'Ошибка входа. Проверьте данные.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
@use '../assets/scss/authorization';
@use '../assets/scss/btn';
@use '../assets/scss/error';
</style>