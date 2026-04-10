<template>
  <div>
    <HeaderApp />
    <RandomMovie :showButtons="true" />
    <TopFilms />
    <FooterApp />
  </div>
</template>

<script setup>
import FooterApp from '@/components/FooterApp.vue'
import HeaderApp from '@/components/HeaderApp.vue'
import RandomMovie from '@/components/RandomMovie.vue'
import TopFilms from '@/components/TopFilms.vue'
</script>

<style lang="scss" scoped></style>