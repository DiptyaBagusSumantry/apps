<template>
  <div>
    <div class="d-flex align-items-center section-title">
      <h2 class="font-weight-bolder text-dark my-0">
        Top Konten
      </h2>
      <feather-icon
        id="popover-top-content"
        icon="HelpCircleIcon"
        size="20"
        class="text-muted cursor-pointer"
      />
      <b-popover
        target="popover-top-content"
        triggers="hover"
        placement="top"
        custom-class="cekbrand-dashboard-popover"
      >
        <span>
          Menampilkan konten terbaik yang pernah kamu dan kompetitormu posting.
        </span>
      </b-popover>
    </div>
    <hr>
    <div class="d-flex justify-content-around">
      <dashboard-kompetitor-top-content-item main-account />
      <dashboard-kompetitor-top-content-item :competitorData="competitors[0]" />
      <div v-if="isShow(3) || download">
        <dashboard-kompetitor-top-content-item :competitorData="competitors[1]" />
      </div>
      <div v-if="isShow(4) || download">
        <dashboard-kompetitor-top-content-item :competitorData="competitors[2]" />
      </div>
    </div>
  </div>
</template>

<script>
import { BPopover } from 'bootstrap-vue'

import DashboardKompetitorTopContentItem from './DashboardKompetitorTopContentItem'

import useDashboardKompetitor from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/useDashboardKompetitor'

export default {
  components: {
    BPopover,
    DashboardKompetitorTopContentItem
  },
  props: {
    download: {
      type: Boolean,
      default: false,
    },
    competitors: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const {
      isShow
    } = useDashboardKompetitor()

    return {
      isShow
    }
  },
}
</script>
