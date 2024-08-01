<template>
  <div>
    <div class="d-flex align-items-center section-title">
      <h2 class="font-weight-bolder text-dark my-0">
        Top Hashtag
      </h2>
      <feather-icon
        id="popover-top-hastag"
        icon="HelpCircleIcon"
        size="20"
        class="text-muted cursor-pointer"
      />
    </div>
    <b-popover
        target="popover-top-hastag"
        triggers="hover"
        placement="top"
        custom-class="cekbrand-dashboard-popover"
    >
      <template #title>
        <span>Top Hashtag</span>
      </template>
      <span>
        Menampilkan hashtag dengan performa terbaik yang pernah kamu pakai maupun kompetitormu pakai. Kamu bisa langsung membandingkan, bahkan dapat mempelajari hastag milik kompetitormu.
      </span>
    </b-popover>
    <hr>
    <div class="d-flex justify-content-around">
      <dashboard-kompetitor-top-hashtag-item main-account />
      <dashboard-kompetitor-top-hashtag-item :competitorData="competitors[0]" />
      <div v-if="isShow(3) || download">
        <dashboard-kompetitor-top-hashtag-item :competitorData="competitors[1]"/>
      </div>
      <div v-if="isShow(4) || download">
        <dashboard-kompetitor-top-hashtag-item :competitorData="competitors[2]" />
      </div>
    </div>
  </div>
</template>

<script>
import { BPopover } from 'bootstrap-vue'

import DashboardKompetitorTopHashtagItem from './DashboardKompetitorTopHashtagItem'

import useDashboardKompetitor from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/useDashboardKompetitor'

export default {
  components: {
    BPopover,
    DashboardKompetitorTopHashtagItem
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
