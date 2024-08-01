<template>
  <section class="dashboard-statistic-account">
    <b-card-header class="pb-1">
      <h3 class="font-weight-bolder text-black mb-0">Performa Akun</h3>
      <b-card-text class="font-small-3 mr-auto ml-1 mt-25">
        ({{ resolveDateRange() }})
      </b-card-text>
    </b-card-header>
    <b-card-body>
      <b-row class="match-height">
        <b-col cols="12" xl="3" sm="6">
          <statistic-card-with-line-chart
            icon="HeartIcon"
            variant="warning"
            :statistic="followersGrowthSeriesData[0] !== undefined ? kFormatter(sumBy(followersGrowthSeriesData, 'y')) : ''"
            :statistic-growth="followersGrowthSeriesData[0] !== undefined && followersCountSeriesData[0] !== undefined ? `${((sumBy(followersGrowthSeriesData, 'y')) / (followersCountSeriesData.find(data => datesAreOnSameDate(data.x, followersGrowthSeriesData[0].x)).y - followersGrowthSeriesData[0].y) * 100).toFixed(0)}%` : ''"
            statistic-title="Jumlah Follower Baru"
            :statistic-subtitle="followersGrowthSeriesData[0] !== undefined ? `sejak ${formatDate(followersGrowthSeriesData[0].x)}` : ''"
            :series-data="followersGrowthChartData.series"
          />
          <b-popover
            target="jumlah follower baru-help-icon"
            triggers="hover"
            placement="top"
            custom-class="cekbrand-dashboard-popover"
          >
            <template #title>
              <span class="font-small-3 font-weight-bolder">Jumlah Follower Baru</span>
            </template>
            <p class="font-small-3 mb-0">Menampilkan data jumlah followers yang mengikuti kamu, terhitung sejak rentang tanggal/hari/waktu yang dipilih.</p>
          </b-popover>
        </b-col>
        <b-col cols="12" xl="3" sm="6">
          <statistic-card-with-line-chart
            icon="MessageSquareIcon"
            variant="danger"
            :statistic="mediaGrowthSeriesData[0] !== undefined ? sumBy(mediaGrowthSeriesData, 'y') : ''"
            :statistic-growth="mediaGrowthSeriesData[0] !== undefined && mediaCountSeriesData[0] !== undefined ? `${(sumBy(mediaGrowthSeriesData, 'y') / (mediaCountSeriesData.find(data => datesAreOnSameDate(data.x, mediaGrowthSeriesData[0].x)).y - mediaGrowthSeriesData[0].y) * 100).toFixed(0)}%` : ''"
            statistic-title="Jumlah Konten Terposting"
            :statistic-subtitle="mediaGrowthSeriesData[0] !== undefined ? `sejak ${formatDate(mediaGrowthSeriesData[0].x)}` : ''"
            :series-data="mediaGrowthChartData.series"
          />
          <b-popover
            target="jumlah konten terposting-help-icon"
            triggers="hover"
            placement="top"
            custom-class="cekbrand-dashboard-popover"
          >
            <template #title>
              <span class="font-small-3 font-weight-bolder">Jumlah Konten Terposting</span>
            </template>
            <p class="font-small-3 mb-0">Menampilkan data jumlah konten yang telah diunggah di akunmu, terhitung sejak tanggal terakhir hingga tanggal sekarang dipilih.</p>
          </b-popover>
        </b-col>
        <b-col cols="12" xl="3" sm="6">
          <statistic-card-with-line-chart
            icon="RadioIcon"
            variant="info"
            :statistic="reachAverage !== null ? reachAverage.toFixed(2) : ''"
            :statistic-growth="reachAverageGrowth !== null ? `${parseFloat(reachAverageGrowth).toFixed(0)}%` : ''"
            statistic-title="Avg Reach"
            :statistic-subtitle="`vs ${diffInDay} hari sebelumnya`"
            :series-data="reachChartData.series"
          />
          <b-popover
            target="avg reach-help-icon"
            triggers="hover"
            placement="top"
            custom-class="cekbrand-dashboard-popover"
          >
            <template #title>
              <span class="font-small-3 font-weight-bolder">Reach</span>
            </template>
            <p class="font-small-3">Menampilkan data berupa rata-rata capaian <strong><em>reach</em></strong> konten kamu, disesuaikan dengan rentang waktu/hari yang dipilih.</p>
            <p class="font-small-3">Data yang di grafik merupakan capaian <strong><em>reach</em></strong> harianmu.</p>
            <p class="font-small-3 mb-0">Pada <strong><em>reach</em></strong> satu akun akan dihitung satu, tidak peduli berapa kali akun tersebut melihat konten kita. Misalkan hari ini ada 5 akun yang melihat konten kita, namun masing-masing dari akun tersebut melihat lebih dari 2 kali hari ini, angka reachnya yang dihitung tetap 5 berdasarkan jumlah akun yang terjangkau.</p>
          </b-popover>
        </b-col>
        <b-col cols="12" xl="3" sm="6">
          <statistic-card-with-line-chart
            icon="SmileIcon"
            avatar-color="#7A62F9"
            color="#5496FF"
            color-gradient="#8739E5"
            :statistic="impressionsAverage !== null ? impressionsAverage.toFixed(2) : ''"
            :statistic-growth="impressionsAverageGrowth !== null ? `${parseFloat(impressionsAverageGrowth).toFixed(0)}%` : ''"
            statistic-title="Avg Impression"
            :statistic-subtitle="`vs ${diffInDay} hari sebelumnya`"
            :series-data="impressionsChartData.series"
          />
          <b-popover
            target="avg impression-help-icon"
            triggers="hover"
            placement="top"
            custom-class="cekbrand-dashboard-popover"
          >
            <template #title>
              <span class="font-small-3 font-weight-bolder">Impression</span>
            </template>
            <p class="font-small-3">Menampilkan data berupa rata-rata capaian <strong><em>impression</em></strong> konten kamu, selama rentang waktu/hari yang dipilih.</p>
            <p class="font-small-3">Data yang di grafik merupakan capaian <strong><em>impression</em></strong> harianmu.</p>
            <p class="font-small-3 mb-0"><strong><em>Impression</em></strong> yaitu berapa kali sebuah akun melihat kontenmu. Misalkan, hari ini ada 5 akun yang melihat kontenmu. Masing-masing dari akun tersebut melihatnya sebanyak 3 kali per hari ini, maka angka impression kontenmu adalah 15.</p>
          </b-popover>
        </b-col>
      </b-row>
      <b-row class="match-height">
        <b-col cols="12" lg="6">
          <b-card>
            <template #header>
              <h4 class="font-weight-bolder text-black mb-0">Engagement Rate</h4>
              <div class="mr-auto ml-50 mb-25">
                <feather-icon
                  id="engagement-rate-help-icon"
                  icon="HelpCircleIcon"
                  size="20"
                  class="text-muted cursor-pointer"
                />
                <b-popover
                  target="engagement-rate-help-icon"
                  triggers="hover"
                  placement="top"
                  custom-class="cekbrand-dashboard-popover"
                >
                  <template #title>
                    <span class="font-small-3 font-weight-bolder">Engagement Rate</span>
                  </template>
                  <p class="font-small-3">Menampilkan jumlah skor (dalam presentase) <strong><em>engagement rate</em></strong> akun kamu yang dihitung sejak tanggal terakhir hingga tanggal sekarang dipilih.</p>
                  <p class="font-small-3 mb-0">Data yang di grafik merupakan capaian <strong><em>engagement rate</em></strong> harianmu.</p>
                </b-popover>
              </div>
            </template>
            <b-card-text class="font-small-3">
              <h1
                v-if="engagementGrowthRate !== null"
                class="mb-0 font-large-1 font-weight-bolder"
                :class="[`text-${parseFloat(engagementGrowthRate) >= 0 ? 'black' : 'danger'}`]"
              >
                {{ parseFloat(engagementGrowthRate).toFixed(2) }}%
              </h1>
              <div v-if="engagementGrowthRateGrowth !== null">
                <span :class="[`text-${parseFloat(engagementGrowthRateGrowth) >= 0 ? 'success' : 'danger'}`]">
                  {{ parseFloat(engagementGrowthRateGrowth) >= 0 ? '+' : '-' }}
                  {{ Math.abs(parseFloat(engagementGrowthRateGrowth)).toFixed(2) }}%
                </span> vs {{ diffInDay }} hari sebelumnya
              </div>
            </b-card-text>
            <vue-apex-charts
              type="line"
              height="240"
              :options="engagementGrowthRateChartData.chartOptions"
              :series="engagementGrowthRateChartData.series"
            />
          </b-card>
        </b-col>
        <b-col cols="12" lg="6">
          <b-card>
            <template #header>
              <h4 class="font-weight-bolder text-black mb-0">Follower Growth Rate</h4>
              <div class="mr-auto ml-50 mb-25">
                <feather-icon
                  id="follower-growth-rate-help-icon"
                  icon="HelpCircleIcon"
                  size="20"
                  class="text-muted cursor-pointer"
                />
                <b-popover
                  target="follower-growth-rate-help-icon"
                  triggers="hover"
                  placement="top"
                  custom-class="cekbrand-dashboard-popover"
                >
                  <template #title>
                    <span class="font-small-3 font-weight-bolder">Follower Growth Rate</span>
                  </template>
                  <p class="font-small-3">Menampilkan jumlah skor (dalam presentase) <strong><em>follower growth rate</em></strong> akun kamu yang dihitung sejak tanggal terakhir hingga tanggal sekarang dipilih.</p>
                  <p class="font-small-3 mb-0">Data yang di grafik merupakan data <strong><em>follower</em></strong> harianmu.</p>
                </b-popover>
              </div>
            </template>
            <b-card-text class="font-small-3">
              <h1
                v-if="followerGrowthRate !== null"
                class="mb-0 font-large-1 font-weight-bolder"
                :class="[`text-${parseFloat(followerGrowthRate) >= 0 ? 'black' : 'danger'}`]"
              >
                {{ parseFloat(followerGrowthRate).toFixed(2) }}%
              </h1>
              <div v-if="followerGrowthRateGrowth !== null">
                <span :class="[`text-${parseFloat(followerGrowthRateGrowth) >= 0 ? 'success' : 'danger'}`]">
                  {{ parseFloat(followerGrowthRateGrowth) >= 0 ? '+' : '-' }}
                  {{ Math.abs(parseFloat(followerGrowthRateGrowth)).toFixed(2) }}%
                </span> vs {{ diffInDay }} hari sebelumnya
              </div>
            </b-card-text>
            <vue-apex-charts
              type="line"
              height="240"
              :options="followerGrowthRateChartData.chartOptions"
              :series="followerGrowthRateChartData.series"
            />
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <b-card no-body class="mb-0">
            <b-card-header class="pb-sm-0">
              <!-- title -->
              <b-card-title class="d-flex mr-50">
                <h4 class="font-weight-bolder text-black mb-50">Engagement
                  <span class="font-weight-normal ml-25">(Like+Comment)</span>
                </h4>
                <div class="ml-50 mb-75">
                  <feather-icon
                    id="engagement-area-help-icon"
                    icon="HelpCircleIcon"
                    size="20"
                    class="text-muted cursor-pointer"
                  />
                  <b-tooltip
                    title="Jumlah Engagement yang terjadi dari konten yang kamu unggah"
                    target="engagement-area-help-icon"
                  />
                </div>
              </b-card-title>
              <!--/ title -->

              <!-- Tips button -->
              <b-button
                id="statistic-account-tips-button"
                variant="gradient-primary"
                class="d-flex align-items-center py-50 px-1 ml-sm-auto"
                v-b-modal.statistic-account-tips-modal
              >
                Tips&nbsp;<span class="d-none d-md-block">Untukmu</span>!
                <feather-icon
                  size="20"
                  icon="ChevronRightIcon"
                  class="ml-25 ml-md-75"
                />
              </b-button>
              <!-- Tips button -->
            </b-card-header>
            <b-card-body class="pb-0">
              <vue-apex-charts
                id="engagement-area-chart"
                type="area"
                height="380"
                :options="engagementAreaChartData.chartOptions"
                :series="engagementAreaChartData.series"
              />
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-card-body>

    <b-modal
      id="statistic-account-tips-modal"
      size="lg"
      centered
      hide-footer
      :visible="false"
      no-stacking
      body-class="d-flex flex-column bg-white py-lg-5"
    >
      <h3 class="font-weight-bolder text-center mb-3">
        Engagement Rate (ER)
      </h3>
      <div class="d-flex align-items-center h-100">
        <div class="w-100">
          <b-button
            block
            class="d-flex align-items-center px-1 py-50 text-reset mb-1"
            variant="outline-dark"
            v-b-modal.statistic-account-engagement-rate-tips-modal
          >
            <b-img
              src="@/assets/images/icons/help.svg"
              width="40"
              class="mr-1"
            />
            <h4 class="lead font-weight-bolder mb-0 text-left">
              Apa arti Engagement Rate?
            </h4>
            <feather-icon
              icon="ChevronRightIcon"
              size="20"
              class="ml-auto"
            />
          </b-button>
          <b-button
            block
            class="d-flex align-items-center px-1 py-50 text-reset mb-1"
            variant="outline-dark"
            v-b-modal.statistic-account-engagement-rate-should-tips-modal
          >
            <b-img
              src="@/assets/images/icons/chart.svg"
              width="40"
              class="mr-1"
            />
            <h4 class="lead font-weight-bolder mb-0 text-left">
              Harus berapa ER kita?
            </h4>
            <feather-icon
              icon="ChevronRightIcon"
              size="20"
              class="ml-auto"
            />
          </b-button>
          <b-button
            block
            class="d-flex align-items-center px-1 py-50 text-reset"
            variant="outline-dark"
            v-b-modal.statistic-account-engagement-rate-improve-tips-modal
          >
            <b-img
              src="@/assets/images/icons/tips-lamp-green.svg"
              width="40"
              class="mr-1"
            />
            <h4 class="lead font-weight-bolder mb-0 text-left">
              Bagaimana cara menaikkannya?
            </h4>
            <feather-icon
              icon="ChevronRightIcon"
              size="20"
              class="ml-auto"
            />
          </b-button>
        </div>
      </div>
    </b-modal>
    <b-modal
      id="statistic-account-engagement-rate-tips-modal"
      centered
      body-class="p-md-3"
      footer-class="justify-content-start"
    >
      <h4 class="font-weight-bolder text-center mb-2 mb-md-3">Apa arti Engagement Rate?</h4>
      <p><strong>Engagement Rate</strong> (ER) merupakan metrik standar dalam media sosial untuk mengukur performa akun (khususnya Instagram dan Facebook).</p>
      <template #modal-footer="{ cancel }">
        <b-button
          variant="link"
          class="text-gray-500"
          v-b-modal.statistic-account-tips-modal
          @click="cancel()"
        >
          Kembali
        </b-button>
      </template>
    </b-modal>
    <b-modal
      id="statistic-account-engagement-rate-should-tips-modal"
      centered
      body-class="p-md-3"
      footer-class="justify-content-start"
    >
      <h4 class="font-weight-bolder text-center mb-2 mb-md-3">Harus berapa sih ER kita?</h4>
      <p><strong>ER Rendah</strong>: Jika &lt;1%, dapat dikatakan bahwa akunmu memiliki ER yang kurang atau rendah.</p>
      <p><strong>ER Sedang</strong>: Jika 1%-3.5%, maka dikatakan angka ER akunmu sedang-sedang saja.</p>
      <p><strong>ER Tinggi</strong>: Jika 3.5%-6% berarti akunmu memiliki ER yang bagus, dan harus terus dipertahankan.</p>
      <p><strong>ER Sangat Tinggi</strong>: Jika &gt;6%, berarti akunmu memiliki performa yang sangat bagus.</p>
      <template #modal-footer="{ cancel }">
        <b-button
          variant="link"
          class="text-gray-500"
          v-b-modal.statistic-account-tips-modal
          @click="cancel()"
        >
          Kembali
        </b-button>
      </template>
    </b-modal>
    <b-modal
      id="statistic-account-engagement-rate-improve-tips-modal"
      centered
      size="lg"
      body-class="p-md-3"
      footer-class="justify-content-start"
    >
      <h4 class="font-weight-bolder text-center mb-2 mb-md-3">Bagaimana cara menaikkan ER?</h4>
      <p>
        Ada beberapa faktor yang mempengaruhi ER, yaitu:
        <ol class="pl-2 mb-0">
          <li>Jumlah likes</li>
          <li>Jumlah shares</li>
          <li>Banyaknya komentar</li>
          <li>Jumlah save</li>
          <li>Direct message</li>
          <li>Mention yang masuk pada akun kita</li>
        </ol>
      </p>
      <p>
        Bila ER kamu turun atau ingin kamu tingkatkan, langkah-langkah berikut bisa kamu lakukan:
        <ul style="list-style-type:none" class="pl-0 mt-50">
          <li class="d-flex mb-50">
            <feather-icon
              icon="CheckSquareIcon"
              size="12"
              class="text-primary mt-25 mr-50"
              style="min-width:12px"
            />
            <p class="mb-0">Konsisten untuk mengunggah konten. Kamu bisa buat jadwal mingguan, berisi jam mengunggah, isi konten, caption konten dan juga hashtag konten.</p>
          </li>
          <li class="d-flex mb-50">
            <feather-icon
              icon="CheckSquareIcon"
              size="12"
              class="text-primary mt-25 mr-50"
              style="min-width:12px"
            />
            <p class="mb-0">Menggunakan hashtag, saat kamu menggunakan hashtag otomatis konten kamu dapat dilihat setiap orang yang melihat hashtag tersebut. Jadi pilih hashtag yang performanya bagus. Kamu bisa memanfaatkan fitur rekomendasi hashtag.</p>
          </li>
          <li class="d-flex mb-50">
            <feather-icon
              icon="CheckSquareIcon"
              size="12"
              class="text-primary mt-25 mr-50"
              style="min-width:12px"
            />
            <p class="mb-0">Membuat konten yang interaktif. Kamu bisa memanfaatkan story dan menggunakan stiker yang disediakan seperti Polling, Question, Instagram Quiz.</p>
          </li>
          <li class="d-flex mb-50">
            <feather-icon
              icon="CheckSquareIcon"
              size="12"
              class="text-primary mt-25 mr-50"
              style="min-width:12px"
            />
            <p class="mb-0">Membuat konten tips yang memiliki kemungkinan untuk disimpan.</p>
          </li>
        </ul>
      </p>
      <p>Bila ER kamu naik, jangan lengah! Tetap posting secara rutin, dan bangun hubungan baik dengan followers-mu. Jangan lupa untuk selalu pantau Instagram kamu, ya!</p>
      <template #modal-footer="{ cancel }">
        <b-button
          variant="link"
          class="text-gray-500"
          v-b-modal.statistic-account-tips-modal
          @click="cancel()"
        >
          Kembali
        </b-button>
      </template>
    </b-modal>
  </section>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BCardFooter, BCardText, BLink, BRow, BCol, BButton, BTooltip, BPopover, BModal, VBModal, BImg,
} from 'bootstrap-vue'
import { onMounted, watch } from '@vue/composition-api'
import VueApexCharts from 'vue-apexcharts'
import { formatDate, kFormatter } from '@core/utils/filter'
import { datesAreOnSameDate } from '@core/utils/utils'
import { sumBy } from 'lodash'

import useDateFilter from '../components/useDateFilter'
import useDashboardStatisticAccount from './useDashboardStatisticAccount'
import StatisticCardWithLineChart from './components/statistics-cards/StatisticCardWithLineChart.vue'

export default {
  components: {
    VueApexCharts,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BCardText,
    BLink,
    BRow,
    BCol,
    BButton,
    BTooltip,
    BPopover,
    BModal,
    BImg,

    StatisticCardWithLineChart,
  },
  directives: {
    'b-modal': VBModal,
  },
  setup() {
    const {
      // Computed
      diffInDay,
      // UI
      resolveDateRange,
    } = useDateFilter()

    const {
      // Computed
      activeAccountData,
      followersCountSeriesData,
      followersGrowthSeriesData,
      followersGrowthChartData,
      followerGrowthRate,
      followerGrowthRateChartData,
      followerGrowthRateGrowth,
      mediaCountSeriesData,
      mediaGrowthSeriesData,
      mediaGrowthChartData,
      reachAverage,
      reachAverageGrowth,
      reachSeriesData,
      reachChartData,
      impressionsAverage,
      impressionsAverageGrowth,
      impressionsSeriesData,
      impressionsChartData,
      engagementGrowthRate,
      engagementGrowthRateGrowth,
      engagementGrowthRateSeriesData,
      engagementGrowthRateChartData,
      engagementAreaChartData,
      // Methods
      calculatePerformaStatistics,
    } = useDashboardStatisticAccount()

    onMounted(() => {
      calculatePerformaStatistics()
    })

    watch(activeAccountData, () => {
      calculatePerformaStatistics()
    })

    return {
      // Computed
      diffInDay,
      followersCountSeriesData,
      followersGrowthSeriesData,
      followersGrowthChartData,
      followerGrowthRate,
      followerGrowthRateChartData,
      followerGrowthRateGrowth,
      mediaCountSeriesData,
      mediaGrowthSeriesData,
      mediaGrowthChartData,
      reachAverage,
      reachAverageGrowth,
      reachSeriesData,
      reachChartData,
      impressionsAverage,
      impressionsAverageGrowth,
      impressionsSeriesData,
      impressionsChartData,
      engagementGrowthRate,
      engagementGrowthRateGrowth,
      engagementGrowthRateSeriesData,
      engagementGrowthRateChartData,
      engagementAreaChartData,
      // UI
      sumBy,
      formatDate,
      kFormatter,
      resolveDateRange,
      datesAreOnSameDate,
    }
  },
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/include';
@import '~@core/scss/base/bootstrap-extended/utilities';

.dashboard-statistic-account {
  .apexcharts-canvas {
    .apexcharts-yaxis,
    .apexcharts-xaxis {
      &-label {
        fill: $gray-500;
      }
    }

    .apexcharts-text,
    .apexcharts-tooltip-text,
    .apexcharts-datalabel-label,
    .apexcharts-datalabel {
      @extend .font-small-2;
    }
  }
}

#engagement-area-chart {
  .apexcharts-canvas {
    .apexcharts-legend {
      padding: 0;
      margin-bottom: 1rem;

      .apexcharts-legend-series {
        display: flex;
        @include media-breakpoint-up(lg) {
          margin-right: 2rem !important;
        }
        .apexcharts-legend-marker {
          margin-right: 0.5rem;
        }
      }
    }
  }
}

#statistic-account-tips-modal {
  .modal-content {
    @include media-breakpoint-up(lg) {
      background-image: url("~@/assets/images/pages/cekbrand/dashboard/statistik-account-tips.svg");
      background-repeat: no-repeat;
      background-size: auto;
      background-position: left;
      height: 600px;
      .modal-body {
        width: 522px;
        margin-left: auto;
      }
    }
  }
  .btn {
    border: 1px solid #C9CBCD !important;
    border-radius: 8px;
  }
}
</style>
