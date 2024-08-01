<template>
  <div>
    <section
      v-if="isActiveAccountDataFetched"
      class="pt-1 pt-lg-0"
    >
      <b-link
        class="text-reset"
        :to="{ path: '/' }"
      >
        <div class="d-flex justify-content-left align-items-center mb-1 mb-md-50 pl-25">
          <b-img
            :src="require('@/assets/images/icons/small-arrow-left.svg')"
            width="7"
          />
          <span class="font-small-2 ml-75">Kembali ke Pilih Akun</span>
        </div>
      </b-link>
      <cekbrand-dashboard-header class="mb-2" />
      <b-tabs
        :justified="$store.state.app.windowWidth <= $themeBreakpoints.md"
        class="cekbrand-dashboard-container mt-md-1"
        v-model="tabIndex"
      >
        <b-tab>
          <template #title>
            <div class="d-flex flex-column">
              <div class="d-flex d-md-none mx-auto">
                <b-img
                  class="cursor-pointer"
                  height="72"
                  :src="require(`@/assets/images/pages/cekbrand/dashboard/kompetitor-tab-icon${tabIndex === 0 ? '-active' : ''}.svg`)"
                />
              </div>
              <span>
                Kompetitor
              </span>
            </div>
          </template>
          <dashboard-kompetitor />
        </b-tab>
        <b-tab>
          <template #title>
            <div class="tab-icon d-flex flex-column">
              <div class="d-flex d-md-none mx-auto">
                <b-img
                  class="cursor-pointer"
                  height="72"
                  :src="require(`@/assets/images/pages/cekbrand/dashboard/statistik-tab-icon${tabIndex === 1 ? '-active' : ''}.svg`)"
                />
              </div>
              <span>
                Statistik
              </span>
            </div>
          </template>
          <dashboard-statistic />
        </b-tab>
        <b-tab>
          <template #title>
            <div class="tab-icon d-flex flex-column">
              <div class="d-flex d-md-none mx-auto">
                <b-img
                  class="cursor-pointer"
                  height="72"
                  :src="require(`@/assets/images/pages/cekbrand/dashboard/top-post-tab-icon${tabIndex === 2 ? '-active' : ''}.svg`)"
                />
              </div>
              <span>
                Top Post
              </span>
            </div>
          </template>
          <dashboard-post />
        </b-tab>
      </b-tabs>
    </section>

    <cekbrand-loading-modal :isFetchDataOnProgress="isFetchActiveAccountDataOnProgress" />
  </div>
</template>

<script>
import { BLink, BImg, BTabs, BTab } from 'bootstrap-vue'
import { onMounted, ref } from '@vue/composition-api'
import { $themeBreakpoints } from '@themeConfig'

import CekbrandDashboardHeader from './CekbrandDashboardHeader.vue'
import DashboardStatistic from './dashboard-statistic/DashboardStatistic.vue'
import DashboardPost from './dashboard-post/DashboardPost.vue'
import CekbrandLoadingModal from '../CekbrandLoadingModal.vue'

import useCekbrandDashboard from  './useCekbrandDashboard'
import DashboardKompetitor from './dashboard-kompetitor/DashboardKompetitor.vue'

export default {
  components: {
    BLink,
    BImg,
    BTabs,
    BTab,

    CekbrandDashboardHeader,
    DashboardStatistic,
    DashboardKompetitor,
    DashboardPost,
    CekbrandLoadingModal,
  },
  beforeRouteUpdate (to, from, next) {
    // React to route changes...
    const userAccountList = this.$store.getters['cekbrand/userAccountList']
    const selectedAccount = userAccountList.find(data => data.username === to.params.username)
    this.$store.dispatch('cekbrand/fetchUserAccountData', selectedAccount.id)
      .catch(error => {
        this.handleInvalidUserActiveAccountToken(selectedAccount, error)
      })
      .finally(() => next())
  },
  setup(props, context) {
    const tabIndex = ref(0)

    const {
      // Refs
      isActiveAccountDataFetched,
      // Computed
      isFetchActiveAccountDataOnProgress,
      // Methods
      setInitialUserActiveAccount,
      handleInvalidUserActiveAccountToken,
    } = useCekbrandDashboard(props, context)

    onMounted(() => {
      setInitialUserActiveAccount()
    })

    return {
      // Refs
      tabIndex,
      isActiveAccountDataFetched,
      // Computed
      isFetchActiveAccountDataOnProgress,
      // Methods
      handleInvalidUserActiveAccountToken,
      // UI
      $themeBreakpoints,
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vue/apps/cekbrand-dashboard.scss";
</style>
