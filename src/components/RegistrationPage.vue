<template>
  <div class="authorization">
    <div class="authorization__wrap">
      <div class="authorization__info">

        <button class="authorization__btn-close btn-close" @click="emit('close')" type="button"></button>

        <img class="authorization__logo" src="../assets/img/logo-set/marusya-black.svg" alt="Логотип" />
        <h1 class="authorization__title">Регистрация</h1>

        <form class="authorization__form" @submit.prevent="onSubmit">
          <div class="authorization__wrap-input">
            <div class="authorization__icon authorization__icon--letter" :class="{ 'error icon-error': errors.email }">

              <input type="email" class="authorization__input" required placeholder="Электронная почта" v-model="email"
                @blur="validateField('email')" />
            </div>
            <div class="authorization__icon authorization__icon--human" :class="{ 'error icon-error': errors.name }">
              <input type="text" class="authorization__input" required placeholder="Имя" v-model="name"
                @blur="validateField('name')" />
            </div>
            <div class="authorization__icon authorization__icon--human" :class="{ 'error icon-error': errors.surname }">
              <input type="text" class="authorization__input" required placeholder="Фамилия" v-model="surname"
                @blur="validateField('surname')" />
            </div>

            <div class="authorization__icon authorization__icon--key" :class="{ 'error icon-error': errors.password }">
              <input type="password" class="authorization__input" required placeholder="Пароль" v-model="password"
                @blur="validateField('password')" />
            </div>

            <div class="authorization__icon authorization__icon--key"
              :class="{ 'error icon-error': errors.passwordConfirm }">

              <input type="password" class="authorization__input" required placeholder="Подтвердите пароль"
                v-model="passwordConfirm" @blur="validateField('passwordConfirm')" />
            </div>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

          </div>
          <div class="authorization__wrap-btn">
            <button type="submit" class="authorization__btn-log-big btn btn-light" :disabled="isLoading">
              {{ isLoading ? 'Регистрация...' : 'Создать аккаунт' }}
            </button>

            <button type="button" class="authorization__btn" @click="$emit('switchToLogin')">
              У меня есть пароль
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

const emit = defineEmits(['close', 'switchToLogin'])

// Реактивные переменные для полей формы
const email = ref('')
const name = ref('')
const surname = ref('')
const password = ref('')
const passwordConfirm = ref('')

// Переменная для хранения сообщения об ошибке
const errorMessage = ref('')

// Флаг загрузки 
const isLoading = ref(false)

// Тип для ошибок
type ErrorFields = 'email' | 'name' | 'surname' | 'password' | 'passwordConfirm'

// Объект для отслеживания ошибок валидации по полям
const errors = reactive({
  email: false,
  name: false,
  surname: false,
  password: false,
  passwordConfirm: false
})

// Инициализация стора авторизации
const authStore = useAuthStore()

// Функция валидации отдельного поля по имени
function validateField(field: string) {
  if (field === 'email') {
    errors.email = !email.value
  } else if (field === 'name') {
    errors.name = !name.value
  } else if (field === 'surname') {
    errors.surname = !surname.value
  } else if (field === 'password') {
    errors.password = !password.value
  } else if (field === 'passwordConfirm') {
    errors.passwordConfirm = !passwordConfirm.value
  }
}

function validateForm() {
  let isValid = true
  const errorKeys: ErrorFields[] = ['email', 'name', 'surname', 'password', 'passwordConfirm']
  errorKeys.forEach(key => {
    errors[key] = false
  })

  // Проверяем каждое поле на заполненность
  if (!email.value) {
    errors.email = true
    isValid = false
  }

  if (!name.value) {
    errors.name = true
    isValid = false
  }

  if (!surname.value) {
    errors.surname = true
    isValid = false
  }

  if (!password.value) {
    errors.password = true
    isValid = false
  }

  if (!passwordConfirm.value) {
    errors.passwordConfirm = true
    isValid = false
  }

  // Проверяем совпадение паролей
  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Пароли не совпадают'
    errors.password = true
    errors.passwordConfirm = true
    isValid = false
  }

  return isValid
}

async function onSubmit() {
  errorMessage.value = ''
  isLoading.value = true

  if (!validateForm()) {
    if (!errorMessage.value) {
      errorMessage.value = 'Заполните все обязательные поля'
    }
    isLoading.value = false
    return
  }

  try {
    console.log('Submitting registration with:', {
      email: email.value,
      name: name.value,
      surname: surname.value,
      password: password.value
    })

    await authStore.register({
      email: email.value,
      name: name.value,
      surname: surname.value,
      password: password.value,
    })

    await authStore.fetchUserProfile()
    console.log('User after profile fetch:', authStore.user)

  } catch (e: any) {
    console.error('Registration error in component:', e)
    errorMessage.value = e.message || 'Ошибка регистрации. Попробуйте еще раз.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
@use '../assets/scss/btn';
@use '../assets/scss/authorization';
@use '../assets/scss/error';
</style>