<template>
  <div id="loading-bg">
    <div class="loading-logo">
      <img src="../../../../../public/logo.png" alt="Logo" />
    </div>
    <div class="loading">
      <div class="effect-1 effects"></div>
      <div class="effect-2 effects"></div>
      <div class="effect-3 effects"></div>
    </div>
  </div>
</template>

<script>
import axios from '@axios'
import { useToast } from 'vue-toastification/composition'
import { useRouter } from '@core/utils/utils'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  setup() {
    const toast = useToast()
    const { router, route } = useRouter()

    axios
      .get('/restapi/user/auth/facebook/login/callback/', { params: route.value.query })
      .then(response => {
        if (response.status === 204) router.push({ name: 'apps-cekbrand' })
        else router.push({ name: 'apps-cekbrand-callback' })
      })
      .catch(error => {
        const { data: errorData, status: errorStatusCode, statusText: errorStatus } = error.response
        if (errorStatusCode >= 500) {
          toast({
            component: ToastificationContent,
            props: {
              title: errorStatus,
              icon: 'AlertCircleIcon',
              variant: 'danger',
              text: errorData.detail || errorData.message || 'Mohon maaf, terjadi kesalahan pada sistem kami.',
            },
          })
          router.push({ name: 'apps-cekbrand' })
        } else {
          router.push({
            name: 'apps-cekbrand-callback-error',
            query: {
              code: errorData.code
            }
          })
        }
      })
  }
}
</script>

<style>
@import url('../../../../../public/loader.css');
</style>
