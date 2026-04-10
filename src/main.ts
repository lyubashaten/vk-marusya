import { createApp } from 'vue'
import App from './App.vue'
import './assets/scss/main.scss'
import { createPinia } from 'pinia'
import router from './router/router.js'
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'https://cinemaguide.skillbox.cc'


const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.mount('#app')