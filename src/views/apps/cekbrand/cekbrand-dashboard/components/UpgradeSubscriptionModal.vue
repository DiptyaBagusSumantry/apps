<template>
  <b-modal
    id="upgrade-subscription-modal"
    ref="refUpgradeSubscriptionModal"
    centered
    size="lg"
    hide-backdrop
    hide-footer
  >
    <div class="d-flex justify-content-between">
      <div
        class="d-flex justify-content-center align-items-center left-content"
      >
        <b-img
          :src="require('@/assets/images/pages/cekbrand/dashboard/upgrade-subscriptions.svg')"
          alt="rocket-image"
          :fluid="$store.state.app.windowWidth < $themeBreakpoints.lg"
        />
      </div>
      <div class="right-content d-flex flex-column align-items-end">
        <div class="mb-2">
          <h2 class="font-weight-bolder mb-2 mb-lg-3">
            Upgrade akun CekBrand-mu untuk mendapatkan layanan tanpa batas!
          </h2>
          <div
            v-for="(item, index) in benefits"
            :key="index"
            class="d-flex"
          >
            <feather-icon
              id="follower-growth-rate-help-icon"
              icon="CheckSquareIcon"
              size="14"
              class="mr-1 mt-25 text-primary"
              style="min-width:15px"
            />
            <p class="font-medium-1">
              {{ item }}
            </p>
          </div>
        </div>
        <div class="mt-auto d-flex justify-content-end">
          <b-button
            variant="flat-secondary"
            @click="hide()"
          >
            Kembali
          </b-button>
          <b-button
            class="d-flex justify-content-between align-items-center ml-1"
            variant="primary"
            :href="`${storeURL}/product/1/subscription-plan`"
            target="_blank"
          >
            <span class="font-weight-bolder mr-1">Upgrade</span>
            <feather-icon
              id="follower-growth-rate-help-icon"
              icon="ChevronRightIcon"
              size="22"
              class="text-white"
              stroke-width="2.5px"
            />
          </b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { computed } from '@vue/composition-api'
import { BButton, BModal, BImg } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { $themeBreakpoints } from '@themeConfig'
import store from '@/store'

export default {
  components: {
    BButton,
    BModal,
    BImg,
  },
  directives: {
    Ripple,
  },
  data: () => ({
    benefits: [
      'Simpan hingga 6 kompetitor sekaligus',
      'Tampilkan data pada rentang tanggal sesuka hatimu',
      'Download report dalam format .csv, .xls, dan .pdf',
      'Detail post media (coming soon)',
      'Analisis sentimen komentar pada media kamu (coming soon)',
    ],
  }),
  computed: {
    storeURL() {
      return `${process.env.VUE_APP_WAS_SITE_URL}/#/store`
    },
  },
  setup(props, context) {
    const currentBreakPoint = computed(() => store.getters['app/currentBreakPoint'])
    const hide = () => { context.refs.refUpgradeSubscriptionModal.hide() }
    const show = () => { context.refs.refUpgradeSubscriptionModal.show() }
    return {
      currentBreakPoint,
      $themeBreakpoints,
      hide,
      show,
    }
  },
}
</script>
<style lang="scss">
@import '@core/scss/base/bootstrap-extended/include';

#upgrade-subscription-modal {
  .modal-body {
    padding: 0px 0px !important;
  }
  .left-content,
  .right-content {
    padding: 40px 37px 40px 29px;
    @include media-breakpoint-down(sm) {
      padding: 20px;
    }
  }
  .left-content {
    width: 336px;
    background-color: #EBF3F9;
  }
  .right-content {
    .btn-flat-secondary:hover {
      background-color: transparent;
    }
  }
}
</style>
