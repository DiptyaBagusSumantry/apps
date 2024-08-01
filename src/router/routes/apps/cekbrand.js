export default [
  {
    path: '/apps/cekbrand',
    name: 'apps-cekbrand',
    component: () => import('@/views/apps/cekbrand/Cekbrand.vue'),
    meta: {
      resource: 'Dashboard',
      contentClass: 'cekbrand',
    },
  },
  {
    path: '/apps/cekbrand/dashboard/:username',
    name: 'apps-cekbrand-dashboard',
    component: () => import('@/views/apps/cekbrand/cekbrand-dashboard/CekbrandDashboard.vue'),
    meta: {
      resource: 'Dashboard',
      group: 'cekbrand-dashboard',
      contentClass: 'cekbrand-dashboard',
    },
  },
  {
    path: '/apps/cekbrand/re-authorization/:username/:socialAccountId',
    name: 'apps-cekbrand-re-authorization',
    component: () => import('@/views/apps/cekbrand/CekbrandReAuthorization.vue'),
    meta: {
      resource: 'Dashboard',
      group: 'cekbrand-dashboard',
    },
  },
  {
    path: '/apps/cekbrand/callback/error',
    name: 'apps-cekbrand-callback-error',
    component: () => import('@/views/apps/cekbrand/cekbrand-callback/CekbrandCallbackError.vue'),
    meta: {
      resource: 'Dashboard',
      group: 'cekbrand-callback',
    },
  },
  {
    path: '/apps/cekbrand/callback',
    name: 'apps-cekbrand-callback',
    component: () => import('@/views/apps/cekbrand/cekbrand-callback/CekbrandCallback.vue'),
    meta: {
      resource: 'Dashboard',
      group: 'cekbrand-callback',
      contentClass: 'cekbrand-callback',
    },
  },
  {
    path: '/apps/cekbrand/callback/login',
    name: 'apps-cekbrand-callback-redirect',
    component: () => import('@/views/apps/cekbrand/cekbrand-callback/CekbrandCallbackLogin.vue'),
    meta: {
      layout: 'full',
      resource: 'Dashboard',
      group: 'cekbrand-callback',
    },
  },
  {
    path: '/apps/cekbrand/onboarding/:step?',
    name: 'apps-cekbrand-onboarding',
    component: () => import('@/views/apps/cekbrand/cekbrand-onboarding/CekbrandOnboarding.vue'),
    meta: {
      resource: 'Dashboard',
      group: 'cekbrand-onboarding',
    },
  },
  {
    path: '/apps/cekbrand/download/:username/:page',
    name: 'cekbrand-download',
    component: () => import('@/views/apps/cekbrand/cekbrand-download/DownloadDashboard.vue'),
    meta: {
      layout: 'full',
      resource: 'Dashboard',
      action: 'download',
    },
  },
]
