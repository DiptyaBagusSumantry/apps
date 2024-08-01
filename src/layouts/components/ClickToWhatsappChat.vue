<template>
  <div>
    <b-button
      class="whatsapp-button"
      v-b-tooltip.hover.v-success.left="{ customClass: 'font-weight-normal' }"
      title="Whatsapp Tim Kami"
      variant="success"
      @click="contactUs()"
    >
      <b-img
        width="50"
        src="@/assets/images/icons/whatsapp.png"
      />
    </b-button>
  </div>
</template>

<script>
import { BButton, VBTooltip, BImg } from 'bootstrap-vue'
export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BButton,
    BImg
  },
  methods: {
    contactUs () {
      window.open('https://wa.me/6281225214920?text=Hello%20Toba.AI!%0AMau%20bertanya%20nih...')
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-success {
  background: linear-gradient(to bottom,#63FE80, #2CB927) !important;
  border: none !important;
}
.whatsapp-button {
  position: fixed;
  bottom: 19px;
  right: 19px;
  text-align: center;
  z-index: 999;
  padding: 0 !important;
}
</style>
