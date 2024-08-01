<template>
  <section class="text-center">
    <b-overlay
      :show="true"
      variant="transparent"
      blur="none"
    >
      <b-img
        src="@/assets/images/logo/toba-logo-no-text.svg"
        width="60"
      />
    </b-overlay>
    <p class="text-center mb-0 mt-1">
      Tunggu hingga data terunduh otomatis.
    </p>
  </section>
</template>

<script>
import { BImg, BOverlay } from 'bootstrap-vue'

export default {
  components: {
    BImg,
    BOverlay,
  },
}
</script>

