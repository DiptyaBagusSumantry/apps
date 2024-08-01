<template>
  <b-card no-body>
    <b-row>
      <b-col cols="12">
        <b-card no-body>
          <b-card-header>
            <b-card-title class="d-flex mr-50">
              <h4 class="font-weight-bolder text-black mb-0">
                Lokasi Asal Follower
              </h4>
              <div class="ml-50 mb-75">
                <feather-icon
                  id="followers-location-help-icon"
                  icon="HelpCircleIcon"
                  size="20"
                  class="text-muted cursor-pointer"
                />
                <b-tooltip
                  title="Sebaran wilayah/ lokasi asal followersmu"
                  target="followers-location-help-icon"
                />
              </div>
            </b-card-title>

            <b-button
              id="statistic-followers-location-tips-button"
              variant="gradient-primary"
              class="d-flex align-items-center py-50 px-1 ml-sm-auto"
              v-b-modal.statistic-followers-location-tips-modal
            >
              Tips&nbsp;<span class="d-none d-md-block">Untukmu</span>!
              <feather-icon
                size="20"
                icon="ChevronRightIcon"
                class="ml-25 ml-md-75"
              />
            </b-button>
          </b-card-header>
          <b-card-body class="border-bottom border-bottom-1">
            <div
              id="mapdiv"
              ref="refFollowersCountryMap"
            />
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="match-height">
      <b-col cols="12" lg="6">
        <b-card no-body>
          <b-card-header class="pb-1">
            <h4 class="font-weight-bolder text-black mb-0">
              Lokasi Berdasarkan Negara
            </h4>
          </b-card-header>
          <b-card-body>
            <div v-for="(data, index) in followersCountryPercentageData" :key="index">
              <div class="progress-wrapper mt-50">
                <b-card-text class="mb-0">
                  {{ data.country }}
                </b-card-text>
                <div class="d-flex flex-row justify-content-between">
                  <div class="d-block w-100 m-auto">
                    <b-progress
                      v-model="data.value"
                      max="100"
                    />
                  </div>
                  <div
                    style="width:15%"
                    class="pl-50"
                  >
                    <b-card-text>
                      {{ parseFloat(data.value).toFixed(0) }}%
                    </b-card-text>
                  </div>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col
        cols="12"
        lg="6"
        :class="{
          'border-left border-left-1': $store.state.app.windowWidth > $themeBreakpoints.lg
        }"
      >
        <b-card
          no-body
          :class="{
            'border-top border-top-1': $store.state.app.windowWidth <= $themeBreakpoints.lg
          }"
        >
          <b-card-header class="pb-1">
            <h4 class="font-weight-bolder text-black mb-0">
              Lokasi Berdasarkan Kota
            </h4>
          </b-card-header>
          <b-card-body>
            <div v-for="(data, index) in followersCityPercentageData" :key="index">
              <div class="progress-wrapper mt-50">
                <b-card-text class="mb-0">
                  {{ data.city }}
                </b-card-text>
                <div class="d-flex flex-row justify-content-between">
                  <div class="d-block w-100 m-auto">
                    <b-progress
                      v-model="data.value"
                      max="100"
                    />
                  </div>
                  <div
                    style="width:15%"
                    class="pl-50"
                  >
                    <b-card-text>
                      {{ parseFloat(data.value).toFixed(0) }}%
                    </b-card-text>
                  </div>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-card-footer>
      <b-card-text
        v-if="followersCityPercentageData[0]"
        class="text-center font-weight-bold"
      >
        <strong class="text-success">{{ parseFloat(followersCityPercentageData[0].value).toFixed(0) }}%</strong> <em>followers</em>-mu berasal dari <strong class="text-success">{{ followersCityPercentageData[0].city }}, {{ followersCityPercentageData[0].country }}</strong>
      </b-card-text>
    </b-card-footer>

    <b-modal
      id="statistic-followers-location-tips-modal"
      centered
      hide-footer
      :visible="false"
      body-class="p-md-3"
    >
      <h4 class="font-weight-bolder text-center mb-2 mb-md-3">Demografi lokasi asal follower</h4>
      <p>
        Kamu bisa manfaatkan fitur ini untuk mencari tau,
        <ul class="font-weight-bolder pl-2 mb-0">
          <li>Karakteristik</li>
          <li>Bahasa sehari-hari yang digunakan</li>
          <li>Apa yang mereka sukai</li>
          <li>Dan, daerah waktu yang digunakan oleh followers-mu (WIB/WIT/WITA).</li>
        </ul>
        Dengan begitu, kamu bisa mengenal follower-mu lebih dalam dan bisa membuat konten yang tertarget sehingga bisa meningkatkan performa akunmu. Cobain, yuk!
      </p>
    </b-modal>
  </b-card>
</template>

<script>
import { onMounted, watch, computed } from '@vue/composition-api'
import {
  BCard, BCardHeader, BCardFooter, BCardBody, BCardTitle, BCardText, BRow, BCol, BProgress, BButton, BTooltip, BModal, VBModal,
} from 'bootstrap-vue'
import { $themeBreakpoints } from '@themeConfig'
import store from '@/store'

import useDashboardStatisticFollowersLocation from './useDashboardStatisticFollowersLocation'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardFooter,
    BCardBody,
    BCardTitle,
    BCardText,
    BRow,
    BCol,
    BProgress,
    BButton,
    BTooltip,
    BModal,
  },
  directives: {
    'b-modal': VBModal,
  },
  setup() {
    const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])

    const {
      // Refs
      followersCityPercentageData,
      followersCountryPercentageData,
      refFollowersCountryMap,
      // Methods
      getFollowersCityPercentageData,
      getFollowersCountryPercentageData,
      generateFollowersCountryMap,
    } = useDashboardStatisticFollowersLocation()

    onMounted(async () => {
      followersCountryPercentageData.value = await getFollowersCountryPercentageData()
      generateFollowersCountryMap()

      followersCityPercentageData.value = await getFollowersCityPercentageData()
    })

    watch(activeAccountData, async () => {
      followersCountryPercentageData.value = await getFollowersCountryPercentageData()
      generateFollowersCountryMap()

      followersCityPercentageData.value = await getFollowersCityPercentageData()
    })

    return {
      // Refs
      followersCityPercentageData,
      followersCountryPercentageData,
      refFollowersCountryMap,
      // UI
      $themeBreakpoints,
    }
  },
}
</script>

<style lang="scss" scoped>
// Core variables and mixins
@import '~@core/scss/base/bootstrap-extended/include';

#mapdiv {
  width: 100%;
  height: 400px;
  @include media-breakpoint-down(sm) {
    height: 200px;
  }
}
</style>
