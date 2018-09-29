import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import PageNotFound from './views/PageNotFound.vue'
import auth from './services/auth'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { auth: false }
    },
    {
      path: '/',
      component: Home,
      meta: { auth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
          meta: {
            title: 'Статистика'
          }
        }
      ]
    },
    {
      path: '*',
      component: PageNotFound,
      meta: { auth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (!auth.checkAuth()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
