import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginOther from '../views/LoginOther.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: LoginOther
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
