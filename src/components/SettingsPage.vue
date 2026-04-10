<template>
    <div class="settings">
        <div class="settings__wrap">
            <span class="settings__icon settings__icon--name">{{ userInitials }}</span>
            <div class="settings__info">
                <span class="settings__name">
                    Имя Фамилия
                </span>
                <div class="settings__name-wrap">
                    <span class="settings__value settings__value--margin">
                        {{ userName }}
                    </span>
                    <span class="settings__value">
                        {{ userSurname }}
                    </span>
                </div>
            </div>
        </div>

        <div class="settings__wrap settings__wrap-email">
            <span class="settings__icon settings__icon--letter">
                <img src="../assets/img/svg/letter.svg" alt="картинка письма">
            </span>
            <div class="settings__info">
                <span class="settings__name">
                    Электронная почта
                </span>
                <span class="settings__value">
                    {{ userEmail }}
                </span>
            </div>
        </div>

        <button class="settings__btn btn btn-light" @click="handleLogout" :disabled="isLoading">
            {{ isLoading ? 'Выход...' : 'Выйти из аккаунта' }}
        </button>
        <div v-if="logoutError" class="error-message">
            {{ logoutError }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);
const logoutError = ref('');

const userName = computed(() => {
    return authStore.user?.name || 'Не указано';
});

const userSurname = computed(() => {
    return authStore.user?.surname || 'Не указана';
});

const userEmail = computed(() => {
    return authStore.user?.email || 'Не указан';
});

const userInitials = computed(() => {
    if (!authStore.user) return '??';

    const firstName = authStore.user.name?.charAt(0) || '';
    const lastName = authStore.user.surname?.charAt(0) || '';

    return (firstName + lastName).toUpperCase();
});

const handleLogout = async () => {
    try {
        isLoading.value = true;
        logoutError.value = '';

        await authStore.logout();
        router.push('/');

    } catch (error: any) {
        console.error('Ошибка при выходе из аккаунта:', error);
        logoutError.value = 'Не удалось выйти из аккаунта. Попробуйте еще раз.';
    } finally {
        isLoading.value = false;
    }
};
</script>
<style scoped lang="scss">
@use '../assets/scss/preloader';
@use '../assets/scss/settings';
@use '../assets/scss/btn'
</style>