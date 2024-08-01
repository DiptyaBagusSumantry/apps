<template>
  <b-card no-body>
    <b-row class="match-height">
      <b-col cols="12" lg="6">
        <b-card
          no-body
          :class="{ 'border-right border-right-1': $store.state.app.windowWidth > $themeBreakpoints.lg }"
        >
          <b-card-header class="pb-1">
            <h4 class="font-weight-bolder text-black mb-0">
              Waktu Follower Online Tertinggi
            </h4>
          </b-card-header>
          <b-card-body>
            <small class="font-weight-bolder text-black">
              Jumlah follower yang online:
            </small>
            <vue-apex-charts
              height="650"
              :options="onlineFollowersChartData.chartOptions"
              :series="onlineFollowersChartData.series"
            />
          </b-card-body>
        </b-card>
      </b-col>
      <b-col
        cols="12"
        lg="6"
        class="d-flex flex-column justify-content-between"
      >
        <b-card
          no-body
          :class="{
            'border-top border-top-1': $store.state.app.windowWidth <= $themeBreakpoints.lg
          }"
        >
          <b-card-header class="mb-1 mb-lg-2">
            <h4 class="font-weight-bolder text-black mb-0">
              Rekomendasi Waktu Posting
            </h4>
          </b-card-header>
          <b-card-body class="mb-auto">
            <div
              v-for="(day, dayIndex) in listOfDays"
              :class="{'mt-2': dayIndex}"
              :key="dayIndex"
            >
              <h4 class="font-weight-bolder text-black mb-0">{{ day }}</h4>
              <div class="d-flex flex-wrap">
                <span
                  v-for="(item, index) in topOnlineFollowersData.filter(data => data.day === day)" :key="index"
                  :class="['badge', item.isMaxValue ? 'badge-success' : 'badge-primary', 'mr-75 mt-50']"
                >
                  {{ item.hour }} WIB
                </span>
              </div>
            </div>
          </b-card-body>
          <b-card-footer class="d-flex flex-column d-xl-block text-wrap mt-1 mt-lg-2 border-0 font-weight-bold">
            <small class="mr-1 mb-50">
              <span class="bullet bullet-primary bullet-sm" />
              Rekomendasi waktu posting
            </small>
            <small>
              <span class="bullet bullet-success bullet-sm" />
              Waktu Engagement Tertinggi dalam seminggu
            </small>
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
    <b-card-footer>
      <b-card-text
        v-if="onlineFollowersData[0]"
        class="text-center font-weight-bold"
      >
        Waktu follower online tertinggimu terjadi terjadi pada hari <strong class="text-success">{{ listOfDays[onlineFollowersData[0].day]  }}</strong>, jam <strong class="text-success">{{ resolveOnlineTime(onlineFollowersData[0].hour) }} WIB</strong>
      </b-card-text>
    </b-card-footer>
  </b-card>
</template>

<script>
import { onMounted, watch } from '@vue/composition-api'
import {
  BCard, BCardHeader, BCardFooter, BCardBody, BCardText, BRow, BCol,
} from 'bootstrap-vue'
import { $themeBreakpoints } from '@themeConfig'

import VueApexCharts from 'vue-apexcharts'

import useDashboardStatisticFollowers from './useDashboardStatisticFollowers'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardFooter,
    BCardBody,
    BCardText,
    BRow,
    BCol,
    VueApexCharts,
  },
  setup() {
    const {
      listOfDays,
      // Refs
      onlineFollowersData,
      topOnlineFollowersData,
      // Computed
      activeAccountData,
      onlineFollowersChartData,
      // Method
      calculateFollowersOnlineStatistics,
      // UI
      resolveOnlineTime,
    } = useDashboardStatisticFollowers()

    onMounted(async () => {
      await calculateFollowersOnlineStatistics()

      window.dispatchEvent(new Event('resize'))
    })

    watch(activeAccountData, async () => {
      await calculateFollowersOnlineStatistics()

      window.dispatchEvent(new Event('resize'))
    })

    return {
      listOfDays,
      // Refs
      onlineFollowersData,
      topOnlineFollowersData,
      // Computed
      onlineFollowersChartData,
      // UI
      $themeBreakpoints,
      resolveOnlineTime,
    }
  },
}
</script>
