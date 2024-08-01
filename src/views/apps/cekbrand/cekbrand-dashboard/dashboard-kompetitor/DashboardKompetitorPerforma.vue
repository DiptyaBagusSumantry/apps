<template>
  <div>
    <div class="d-flex align-items-center section-title mt-3">
      <h2 class="font-weight-bolder text-dark my-0">
        Performa akun kompetitor
      </h2>
      <feather-icon
        id="popover-perform-competitor"
        icon="HelpCircleIcon"
        size="20"
        class="text-muted cursor-pointer"
      />
    </div>
    <b-popover
      target="popover-perform-competitor"
      triggers="hover"
      placement="top"
      custom-class="cekbrand-dashboard-popover"
    >
      <template #title>
        <span>Performa akun kompetitor</span>
      </template>
      <span>
        Menyajikan data akun kompetitormu, mulai dari like, comment, dan engagement rate-nya berdasarkan rentang tanggal yang kamu pilih. Dan, dapat kamu bandingkan langsung dengan performa akun Instagram-mu.
      </span>
    </b-popover>
    <hr>
    <div class="d-flex justify-content-around">
      <dashboard-kompetitor-performa-item
        main-account
      />
      <dashboard-kompetitor-performa-item
        :competitorData="competitors[0]"
      />
      <div v-if="isShow(3) || download">
        <dashboard-kompetitor-performa-item
          :competitorData="competitors[1]"
        />
      </div>
      <div v-if="isShow(4) || download">
        <dashboard-kompetitor-performa-item
          :competitorData="competitors[2]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { BPopover } from 'bootstrap-vue'

import DashboardKompetitorPerformaItem from './DashboardKompetitorPerformaItem'

import useDashboardKompetitor from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/useDashboardKompetitor'

export default {
  components: {
    BPopover,
    DashboardKompetitorPerformaItem
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
