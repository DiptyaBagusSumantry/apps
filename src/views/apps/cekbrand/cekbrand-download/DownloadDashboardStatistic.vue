<template>
  <div id="download-dashboard-statistic">
    <b-card
      class="performa-chart w-100"
      no-body
    >
      <div
        v-if="page === 1"
        class="dashboard-statistic-account"
      >
        <dashboard-statistic-account />
      </div>
      <div
        v-if="page !== 1"
        class="dashboard-statistic-followers"
      >
        <b-card-header class="pb-1">
          <h3 class="font-weight-bolder text-black mb-0">
            Followers
          </h3>
          <b-card-text class="font-small-3 mr-auto ml-1 mt-25">
            ({{ resolveDateRange() }})
          </b-card-text>
        </b-card-header>
        <b-card-body>
          <dashboard-statistic-followers-online v-if="page === 2" />
          <dashboard-statistic-followers-location v-if="page === 3" />
          <dashboard-statistic-followers-gender-age v-if="page === 4" />
        </b-card-body>
      </div>
    </b-card>
  </div>
</template>

<script>
import { BCard, BCardBody, BCardHeader, BCardText } from 'bootstrap-vue'

import DashboardStatisticAccount from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-statistic/DashboardStatisticAccount.vue'
import DashboardStatisticFollowersOnline from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-statistic/DashboardStatisticFollowersOnline.vue'
import DashboardStatisticFollowersLocation from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-statistic/DashboardStatisticFollowersLocation.vue'
import DashboardStatisticFollowersGenderAge from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-statistic/DashboardStatisticFollowersGenderAge.vue'

import useDateFilter from '@/views/apps/cekbrand/cekbrand-dashboard/components/useDateFilter'

export default {
  components: {
    BCard,
    BCardBody,
    BCardHeader,
    BCardText,
    DashboardStatisticAccount,
    DashboardStatisticFollowersOnline,
    DashboardStatisticFollowersLocation,
    DashboardStatisticFollowersGenderAge,
  },
  props: {
    page: {
      type: Number,
      default: 1,
    },
  },
  setup() {
    const {
      // UI
      resolveDateRange,
    } = useDateFilter()

    return {
      resolveDateRange,
    }
  }
}
</script>

<style lang="scss">
#download-dashboard-statistic {
  .card {
    border: 1px solid #E9EAEB;
    border-radius: 4px;
  }
  .performa-chart {
    padding: 3px 19px;

    .section-title {
      margin-bottom: 16px;

      h2 {
        margin-right: 10px;
      }
      span {
        line-height: 24px;
      }
    }
  }
  .dashboard-statistic-account {
    div.card-body > div.match-height {
      &:nth-child(1) > [class*=col] {
        flex: 0 0 25%;
        max-width: 25%;
      }
      &:nth-child(2) > [class*=col] {
        flex: 0 0 50%;
        max-width: 50%;
      }
    }
  }
  .dashboard-statistic-followers {
    [class*=card] > div.match-height {
      & > [class*=col] {
        flex: 0 0 50%;
        max-width: 50%;
      }
    }
  }
}
</style>
