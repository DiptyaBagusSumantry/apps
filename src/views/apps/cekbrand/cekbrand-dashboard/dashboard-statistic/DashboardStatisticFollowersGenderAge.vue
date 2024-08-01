<template>
  <b-card no-body class="mb-0">
    <b-card-header class="d-flex justify-content-between">
      <div class="d-flex justify-content-start">
        <h4 class="font-weight-bolder text-black">
          Demografi gender dan usia follower
        </h4>
        <div class="ml-50 mb-75">
          <feather-icon
            id="followers-gender-age"
            icon="HelpCircleIcon"
            size="20"
            class="text-muted cursor-pointer"
          />
          <b-tooltip
            title="Perbandingan jumlah followers laki-laki dan perempuan serta rentang usia followers-mu"
            target="followers-gender-age"
          />
        </div>
      </div>

      <b-button
        id="statistic-followers-gender-age-tips-button"
        variant="gradient-primary"
        class="d-flex align-items-center py-50 px-1 ml-md-auto"
        v-b-modal.statistic-followers-gender-age-tips-modal
      >
        Tips&nbsp;<span class="d-none d-md-block">Untukmu</span>!
        <feather-icon
          size="20"
          icon="ChevronRightIcon"
          class="ml-25 ml-md-75"
        />
      </b-button>
    </b-card-header>
    <b-card-body>
      <b-row class="match-height">
        <b-col xl='6'>
          <b-card
            no-body
            class="d-flex flex-column flex-sm-row justify-content-start align-items-center mb-2 mb-xl-0"
            :class="{ 'border-right border-right-1': $store.state.app.windowWidth >= $themeBreakpoints.xl }"
          >
            <vue-apex-charts
              :options="followersGenderDonutChartData.chartOptions"
              :series="followersGenderDonutChartData.series"
              height='250px'
            />
            <div class="d-flex flex-row flex-sm-column ml-sm-2 mt-3 mt-sm-0">
              <b-card-text
                v-if="followersGenderPercentageData['F'] !== undefined"
                class="text-nowrap mb-sm-5"
              >
                <p class="text-followers-female font-weight-bolder font-large-2">
                  {{ Math.round(followersGenderPercentageData['F']) }}%
                </p>
                <span class="font-weight-bold">Follower Wanita</span>
              </b-card-text>
              <b-card-text
                v-if="followersGenderPercentageData['M'] !== undefined"
                class="text-nowrap ml-2 ml-sm-0"
              >
                <p class="text-primary font-weight-bolder font-large-2">
                  {{ Math.round(followersGenderPercentageData['M']) }}%
                </p>
                <span class="font-weight-bold">Follower Laki-laki</span>
              </b-card-text>
            </div>
          </b-card>
        </b-col>
        <b-col xl='6'>
          <vue-apex-charts
            :options="followersGenderAgeBarChartData.chartOptions"
            :series="followersGenderAgeBarChartData.series"
            height="240px"
          />
        </b-col>
      </b-row>
    </b-card-body>
    <b-card-footer>
      <b-card-text
        v-if="followersGenderAgeData[0]"
        class="text-center font-weight-bold"
      >
        Mayoritas <em>followers</em>-mu adalah <strong class="text-success">{{ followersGenderAgeData[0].gender === 'F' ? 'Wanita' : 'Laki-laki' }}</strong> usia <strong class="text-success">{{ followersGenderAgeData[0].age }} tahun</strong>
      </b-card-text>
    </b-card-footer>

    <b-modal
      id="statistic-followers-gender-age-tips-modal"
      centered
      hide-footer
      size="lg"
      :visible="false"
      body-class="p-md-3"
    >
      <h4 class="font-weight-bolder text-center mb-2">Demografi gender dan usia follower</h4>
      <ul class="pl-2">
        <li class="mb-75">
          Data gender bisa kamu manfaatkan untuk menjadi landasan pembuatan konten.
        </li>
        <li class="mb-75">
          Bila followersmu lebih dominan ke satu gender tertentu, kontenmu dapat disesuaikan dengan apa yang lebih disukai oleh gender tersebut (warna, gaya bahasa, topik yang dibahas).
        </li>
        <li class="mb-75">
          Bila target marketmu adalah laki-laki namun followersmu lebih dominan perempuan atau sebaliknya, maka kamu harus evaluasi ulang konten yang kamu buat. Kemungkinan besar konten yang kamu buat tidak relate dengan targetmu sebenarnya
        </li>
      </ul>
      <p>
        Intermezzo sedikit dulu, ya. Kita mau ngomongin generasi usia yang umum digunakan di Indonesia, nih. Ada apa saja:
      </p>
      <app-collapse
        accordion
        type="margin"
        class="mb-1"
      >
        <app-collapse-item title="Baby Boomer">
          Lahir tahun 1946-1964, generasi ini memiliki jiwa kompetitif, tidak suka dikritik dan fokus pada karir. Konten yang cocok untuk generasi ini adalah tips-tips untuk meningkatkan kualitas diri.
        </app-collapse-item>
        <app-collapse-item title="Gen X">
          Lahir tahun 1965-1980, Gen X memiliki karakteristik yang suka membuat diri sendiri bahagia dan mengedepankan work-life-balance. Konten yang akan disukai mereka adalah konten trivia yang bikin mereka happy dan tidak jenuh.
        </app-collapse-item>
        <app-collapse-item title="Gen Y (Millenial)">
          Lahir tahun 1981-1996, Gen millenial merupakan generasi yang mendominasi saat ini. Mereka cenderung menyukai konten yang melibatkan mereka (interaksi).
        </app-collapse-item>
        <app-collapse-item title="Gen Z">
          Lahir tahun 1997-2012, generasi ini lebih mengedepankan value. Mereka akan lebih tertarik dengan konten kitabila kita mengangkat isu yang menarik seperti isu lingkungan.
        </app-collapse-item>
      </app-collapse>
      <p class="mb-0">
        Nah, kamu bisa mengelompokkan followers-mu berdasarkan generasinya, dan kamu bisa buat konten yang sesuai dengan karakteristiknya.
      </p>
    </b-modal>
  </b-card>
</template>

<script>
import { onMounted, watch } from '@vue/composition-api'
import {
  BCard, BCardHeader, BCardFooter, BCardBody, BCardText, BRow, BCol, BButton, BTooltip, BModal, VBModal
} from 'bootstrap-vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
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
    BButton,
    BTooltip,
    BModal,
    VueApexCharts,
    AppCollapse,
    AppCollapseItem,
  },
  directives: {
    'b-modal': VBModal,
  },
  setup() {
    const {
      // Refs
      followersGenderAgeData,
      followersGenderPercentageData,
      // Computed
      activeAccountData,
      followersGenderDonutChartData,
      followersGenderAgeBarChartData,
      // Method
      calculateFollowersGenderAgeStatistics,
    } = useDashboardStatisticFollowers()

    onMounted(() => {
      calculateFollowersGenderAgeStatistics()
    })

    watch(activeAccountData, () => {
      calculateFollowersGenderAgeStatistics()
    })

    return {
      // Refs
      followersGenderAgeData,
      followersGenderPercentageData,
      // Computed
      followersGenderDonutChartData,
      followersGenderAgeBarChartData,
      // UI
      $themeBreakpoints,
    }
  },
}
</script>
<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/include';
@import '~@core/scss/base/bootstrap-extended/utilities';

#statistic-followers-gender-age-tips-modal {
  [class^="collapse-"] {
    & > .card {
      box-shadow: none !important;
      border: 1px solid #C9CBCD;
      border-radius: 8px;
      .card-header {
        border-bottom: 1px solid #C9CBCD !important;
        padding: 12px 20px;
      }
      .card-body {
        padding: 0px 20px 12px 20px;
      }

      &.open {
        border-bottom: 1px solid #C9CBCD !important;
        .card-header {
          border-bottom: 0 solid transparent !important
        }
      }
    }
    .collapse-title {
      @extend .font-small-3;
      font-weight: 600;
    }
  }
  .collapse-icon {
    [data-toggle=collapse]:after {
      background-size: 18px;
      transform: rotate(0deg);
    }
    [aria-expanded=true]:after {
      transform: rotate(-180deg);
    }
  }
}
</style>
