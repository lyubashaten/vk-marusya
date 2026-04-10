import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import Ganre from '@/views/Ganre.vue'
import FilmPage from '@/views/FilmPage.vue'
import ShoosenGanre from '@/views/ShoosenGanre.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ganry',
    name: 'Ganre',
    component: Ganre
  },
  {
    path: '/films/genre/:genre',
    name: 'FilmsByGenre',
    component: ShoosenGanre
  },
  {
    path: '/film/:id',
    name: 'FilmPage',
    component: FilmPage,
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router