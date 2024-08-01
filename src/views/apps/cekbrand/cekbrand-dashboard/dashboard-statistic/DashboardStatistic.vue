<template>
  <section class="dashboard-statistic">
    <header class="d-flex flex-column mt-1 mb-2 mt-lg-2 mb-lg-3">
      <label
        class="text-nowrap font-small-2 text-gray-500"
        for="page-select"
      >
        Tampilkan:
      </label>
      <v-select
        v-model="page"
        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
        :options="pageOptions"
        :clearable="false"
        input-id="page-select"
        class="mr-sm-auto font-small-3"
      />
    </header>
    <section>
      <b-card
        v-show="['Semua', 'Performa Akun'].includes(page)"
        no-body
        class="mb-0"
        :class="{'mb-2 mb-lg-3': page === 'Semua'}"
      >
        <dashboard-statistic-account />
      </b-card>
      <b-card
        v-show="['Semua', 'Followers'].includes(page)"
        no-body
        class="mb-0"
      >
        <dashboard-statistic-followers />
      </b-card>
    </section>
  </section>
</template>

<script>
import { BCard } from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import vSelect from 'vue-select'

import DashboardStatisticAccount from './DashboardStatisticAccount.vue'
import DashboardStatisticFollowers from './DashboardStatisticFollowers.vue'

export default {
  components: {
    BCard,
    vSelect,

    DashboardStatisticAccount,
    DashboardStatisticFollowers,
  },
  setup() {
    const page = ref('Semua')
    const pageOptions = ['Semua', 'Performa Akun', 'Followers']

    return {
      page,
      pageOptions,
    }
  }
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/include';

.dashboard-statistic {
  header {
    .v-select {
      min-width: 200px;
      border-radius: 4px;
      .vs__dropdown-toggle {
        border: 1px solid $primary;
      }
      .vs__open-indicator {
        stroke: $primary;
        stroke-width: 2px;
      }
      .vs__selected {
        color: $primary !important;
        font-weight: 500;
      }
    }
  }

  section {
    .card {
      background: #fbfbfc;
      border: 1px solid #e9eaeb;
      border-radius: 0;
      box-shadow: none;

      .card .card {
        border: none;
        box-shadow: none !important;
        margin-bottom: 0;
      }
    }
  }
}
</style>
<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>