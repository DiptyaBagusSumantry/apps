<template>
  <section id="dashboard-statistic-followers">
    <b-card-header class="pb-1">
      <h3 class="font-weight-bolder text-black mb-0">
        Followers
      </h3>
      <b-card-text class="font-small-3 mr-auto ml-1 mt-25">
        ({{ resolveDateRange() }})
      </b-card-text>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col cols="12">
          <dashboard-statistic-followers-online />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <dashboard-statistic-followers-location />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <dashboard-statistic-followers-gender-age />
        </b-col>
      </b-row>
    </b-card-body>
  </section>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BCardText, BRow, BCol,
} from 'bootstrap-vue'

import DashboardStatisticFollowersGenderAge from './DashboardStatisticFollowersGenderAge.vue'
import DashboardStatisticFollowersOnline from './DashboardStatisticFollowersOnline.vue'
import DashboardStatisticFollowersLocation from './DashboardStatisticFollowersLocation.vue'

import useDateFilter from '../components/useDateFilter'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BCardText,
    BRow,
    BCol,
    DashboardStatisticFollowersGenderAge,
    DashboardStatisticFollowersOnline,
    DashboardStatisticFollowersLocation,
  },
  setup() {
    const {
      // UI
      resolveDateRange,
    } = useDateFilter()

    return {
      resolveDateRange,
    }
  },
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/include';

#dashboard-statistic-followers {
  .apexcharts-legend {
    padding: 0 0px;
    justify-content: start !important;
    left: -5px !important;
    .apexcharts-legend-text {
      color: $body-color !important;
      margin-right: 5px !important;
      font-weight: 300 !important;
    }
    .apexcharts-legend-marker {
      margin-right: 5px !important;
    }
  }
  .badge {
    width: 75px;
    font-weight: 400;
  }

  .text-followers-female {
    color: #EA548B;
  }
}
</style>
