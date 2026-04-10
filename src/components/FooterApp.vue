<template>
  <div class="social-links">
    <a v-for="(link, name) in socialLinks" :key="name" :href="link" target="_blank" rel="noopener noreferrer"
      class="social-links__item" :aria-label="`Перейти в ${name}`">
      <img :src="icons[name]" :alt="name" class="social-links__icon" />
    </a>
  </div>
</template>


<script setup lang="ts">
import vkLogo from '../assets/img/svg/vk-logo.svg'
import youtubeLogo from '../assets/img/svg/youtube-logo.svg'
import odnoklassnikiLogo from '../assets/img/svg/odnoklassniki-logo.svg'
import telegramLogo from '../assets/img/svg/telegram-logo.svg'

const socialLinks: Record<string, string> = {
  vk: 'https://vk.com/id184663241',
  youtube: '#',
  odnoklassniki: '#',
  telegram: '#'
}

const icons: Record<string, string> = {
  vk: vkLogo,
  youtube: youtubeLogo,
  odnoklassniki: odnoklassnikiLogo,
  telegram: telegramLogo
}
</script>

<style scoped lang="scss">
@use '../assets/scss/main.scss';
@use '../assets/scss/social-link'
</style>