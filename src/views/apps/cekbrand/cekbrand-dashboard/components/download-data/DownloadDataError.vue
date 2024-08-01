<template>
  <section class="text-center">
    <b-img
      class="px-2 mb-2"
      src="@/assets/images/pages/cekbrand/dashboard/download-failed.png"
      fluid
    />
    <p>Gagal mengunduh data. Coba lagi?</p>
    <b-button
      variant="primary"
      @click="$emit('re-download-data')"
    >
      Unduh
    </b-button>
  </section>
</template>

<script>
import { BImg, BButton } from 'bootstrap-vue'

export default {
  components: {
    BImg,
    BButton,
  },
}
</script>

