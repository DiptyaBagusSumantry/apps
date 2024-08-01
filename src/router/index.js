import Vue from 'vue'
import VueRouter from 'vue-router'
import { configureScope, setContext, setUser } from '@sentry/vue'

import { canNavigate } from '@/libs/acl/routeProtection'
import {
  getUserData, isUserLoggedIn, initSSO, getCookie, logoutSSO,
} from '@/auth/utils'

// Routes
import apps from './routes/apps'
import cekbrand from './routes/apps/cekbrand'
import pages from './routes/pages'

Vue.use(VueRouter)

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/apps/cekbrand',
    },
    ...apps,
    ...cekbrand,
    ...pages,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()
  const userData = getUserData()

  // Logout if cookie not set or expired
  if (isLoggedIn && getCookie('loginstatus') !== 'loggedin') {
    return logoutSSO()
  }

  if (isLoggedIn) {
    setContext('activeUser', { fullName: userData.fullName })
    setUser({
      id: userData.id,
      email: userData.email,
    })
  } else {
    configureScope(scope => {
      scope.clear()
      scope.setUser(null)
    })
  }

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return initSSO({ to })

    // If logged in => not authorized
    return next({ name: 'misc-not-authorized' })
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    next('/')
  }

  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
