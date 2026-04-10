<template>
  <div v-if="isOpen" class="trailer" @click.self="close">
    <div class="trailer__wrapper">
      <button
        v-if="showCloseButton"
        class="trailer__btn-close btn-close"
        @click="close"
        aria-label="Закрыть трейлер"
      ></button>

      <div v-if="loading" class="preloader"></div>

      <div
        v-else
        class="trailer__content"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
      >
        <iframe
          v-if="trailerUrl"
          ref="iframeRef"
          :src="youtubeEmbedUrl"
          class="trailer__video"
          width="960"
          height="540"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>

        <div v-else>Трейлер недоступен</div>

        <div
          class="trailer__overlay"
          :class="{ 'trailer__overlay--visible': showControls }"
          @click.stop="togglePlay"
          v-if="showControls"
        >
          <div v-if="showControls" class="trailer__title">{{ title }}</div>

          <button v-if="showControls" class="trailer__play-pause-btn">
            <img
              class="trailer__icon"
              :src="isPlaying ? pauseIcon : playIcon"
              :alt="isPlaying ? 'Пауза' : 'Воспроизвести'"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import playIcon from '../assets/img/svg/play-logo.svg'
import pauseIcon from '../assets/img/svg/stop-logo.svg'

const isOpen = ref(false)
const loading = ref(false)
const trailerUrl = ref('')
const hover = ref(false)
const isPlaying = ref(false)
const title = ref('Трейлер')
const iframeRef = ref<HTMLIFrameElement | null>(null)

const windowWidth = ref(window.innerWidth)

function onResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const showControls = computed(() => hover.value && !isPlaying.value)
const isNarrowScreen = computed(() => windowWidth.value < 1180)
const showCloseButton = computed(() => !isPlaying.value)

const youtubeEmbedUrl = computed(() => {
  if (!trailerUrl.value) return ''
  const videoIdMatch = trailerUrl.value.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
  const videoId = videoIdMatch ? videoIdMatch[1] : trailerUrl.value
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`
})

let player: any = null

function loadYouTubeAPI() {
  return new Promise<void>((resolve) => {
    if ((window as any).YT && (window as any).YT.Player) {
      resolve()
      return
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    ;(window as any).onYouTubeIframeAPIReady = () => {
      resolve()
    }
  })
}

async function initPlayer() {
  await loadYouTubeAPI()

  if (!iframeRef.value) {
    setTimeout(initPlayer, 100)
    return
  }

  if (player) {
    player.destroy()
    player = null
  }

  player = new (window as any).YT.Player(iframeRef.value, {
    events: {
      onReady: () => {
        loading.value = false
        isPlaying.value = true
        player.playVideo()
      },
      onStateChange: (event: any) => {
        if (event.data === 1) {
          isPlaying.value = true
        } else if (event.data === 2 || event.data === 0) {
          isPlaying.value = false
        }
      },
      onError: () => {
        loading.value = false
        console.error('Ошибка загрузки видео')
      }
    }
  })
}

watch(isOpen, (newVal) => {
  if (newVal) {
    loading.value = false
    isPlaying.value = false
    setTimeout(() => {
      initPlayer()
    }, 0)
  } else {
    if (player) {
      player.stopVideo()
      player.destroy()
      player = null
    }
    loading.value = false
    isPlaying.value = false
    trailerUrl.value = ''
  }
})

function open(url?: string, movieTitle?: string) {
  if (url) {
    trailerUrl.value = url
  } else {
    trailerUrl.value = ''
  }
  if (movieTitle) {
    title.value = movieTitle
  }
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function togglePlay() {
  if (!player) return
  if (isPlaying.value) {
    player.pauseVideo()
  } else {
    player.playVideo()
  }
}

defineExpose({
  open,
  close
})
</script>


<style scoped lang="scss">
@use '../assets/scss/btn';
@use '../assets/scss/preloader';
@use '../assets/scss/trailer-modal'
</style>