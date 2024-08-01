<template>
  <div
    class="sidebar-toggler bg-gradient-primary d-flex align-items-center justify-content-around"
    @mouseenter="isMouseHovered(true)"
    @mouseleave="isMouseHovered(false)"
  >
    <div class="text-center">
      <b-img
        :src="require('@/assets/images/logo/widyaanalytic-logo-white-no-text.svg')"
        width="24"
        alt="toba no text logo"
      />
      <p class="mb-0 text-white">
        menu
      </p>
    </div>
    <feather-icon
      icon="ChevronRightIcon"
      stroke="white"
      size="24"
    />
  </div>
</template>

<script>
import store from '@/store'
import { BImg } from 'bootstrap-vue'

export default({
  components: {
    BImg,
  },
  setup () {
    const isMouseHovered = val => store.commit('verticalMenu/UPDATE_MOUSE_HOVERED', val)

    return {
      isMouseHovered,
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/vue/components/sidebar-toggler.scss';
</style>
