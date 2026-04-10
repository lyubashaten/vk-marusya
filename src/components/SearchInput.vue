<template>
  <!-- Десктопный поиск (ширина> 560) -->
  <div v-if="!isBelow560" class="search search--laptop" ref="searchContainer">

    <input ref="searchInput" class="search__input search__input--laptop" type="search" placeholder="Поиск"
      v-model="searchStore.query" @input="handleSearch" @focus="searchStore.openDropdown()" />

    <svg class="search__input-logo search__input-logo--laptop" @click="toggleDesktopSearch" tabindex="0"
      @keydown.enter.prevent="toggleDesktopSearch" role="button" aria-label="Открыть поиск" width="24" height="24"
      viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

      <path
        d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
        fill="currentColor" />

    </svg>
  </div>

  <!-- Мобильный поиск (ширина <= 560) -->
  <div v-else class="search search--mobile" ref="searchContainer">
    <svg v-if="!isSearchActive" class="search__input-logo search__input-logo--active" @click="openMobileSearch"
      tabindex="0" @keydown.enter.prevent="openMobileSearch" role="button" aria-label="Открыть поиск" width="24"
      height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
        fill="currentColor" />
    </svg>

    <!-- Показываем поле и оверлей, если поиск активен -->
    <div v-if="isSearchActive" class="search__mobile-active" :class="{ hidden: !isSearchActive }">
      <div class="search__overlay" @click="closeSearch"></div>
      <div class="search__mobile-input-container">
        <input ref="searchInput" class="search__input search__input--mobile" type="search" placeholder="Поиск"
          v-model="searchStore.query" @input="handleSearch" @focus="searchStore.openDropdown()" />
        <svg class="search__input-logo search__input-logo--mobile" @click="focusSearchInput" tabindex="0"
          @keydown.enter.prevent="focusSearchInput" role="button" aria-label="Открыть поиск" width="24" height="24"
          viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
            fill="currentColor" />
        </svg>
      </div>
    </div>
  </div>

  <!-- Выпадающий список результатов -->
  <SearchMovies v-if="searchStore.isOpen && searchStore.hasResults" class="search__dropdown" />
</template>

<script setup lang="ts">
import { watch, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useSearchStore } from '@/store/useSearchStore';
import SearchMovies from './SearchMovies.vue';
import { useAuthStore } from '@/store/useAuthStore';

const searchStore = useSearchStore();
const authStore = useAuthStore();
const isSearchActive = ref(false);
const isDesktopSearchActive = ref(false);
const isBelow560 = ref(window.innerWidth <= 560);
const searchInput = ref<HTMLInputElement | null>(null);
const searchContainer = ref<HTMLElement | null>(null);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const updateWidth = () => {
  isBelow560.value = window.innerWidth <= 560;
  if (!isBelow560.value) {
    isSearchActive.value = false;
    isDesktopSearchActive.value = false;
    document.body.style.overflow = '';
  }
};

const openMobileSearch = async () => {
  if (!isBelow560.value) return;

  if (!isSearchActive.value) {
    isSearchActive.value = true;
    await nextTick();
    searchInput.value?.focus();
    document.body.style.overflow = 'hidden';
  } else {
    closeSearch();
  }
};

const toggleDesktopSearch = async () => {
  if (isBelow560.value) return;

  isDesktopSearchActive.value = !isDesktopSearchActive.value;
  if (isDesktopSearchActive.value) {
    await nextTick();
    searchInput.value?.focus();
    searchStore.openDropdown();
    document.body.style.overflow = 'hidden';
  } else {
    searchStore.closeDropdown();
    document.body.style.overflow = '';
  }
};

const closeDesktopSearch = () => {
  isDesktopSearchActive.value = false;
  searchStore.closeDropdown();
  document.body.style.overflow = '';
};

const focusSearchInput = async () => {
  await nextTick();
  searchInput.value?.focus();
};

const closeSearch = () => {
  if (isBelow560.value) {
    isSearchActive.value = false;
    searchStore.closeDropdown();
    document.body.style.overflow = '';
  }
};

const handleSearch = (event: Event) => {
  const query = (event.target as HTMLInputElement).value;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    searchStore.searchMovies(query);
  }, 300);
};

const handleClickOutside = (event: Event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    if (isBelow560.value && isSearchActive.value) {
      closeSearch();
    }
  }
};

watch(
  () => isSearchActive.value,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);

onMounted(async () => {
  window.addEventListener('resize', updateWidth);
  document.addEventListener('click', handleClickOutside);

  const user = await authStore.tryAutoLogin();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
  document.removeEventListener('click', handleClickOutside);
  document.body.style.overflow = '';
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<style scoped lang="scss">
@use '../assets/scss/search-input'
</style>