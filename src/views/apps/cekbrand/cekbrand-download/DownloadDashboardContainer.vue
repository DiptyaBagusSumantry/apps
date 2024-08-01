<template>
  <div
    id="download-dashboard-container"
    class="d-flex flex-column"
  >
    <div class="download-header">
      <div class="d-flex justify-content-right">
        <b-img
          class="ml-auto"
          width="193px"
          height="40px"
          :src="require('@/assets/images/logo/toba-logo.svg')"
        />
      </div>
      <hr class="m-0">
    </div>
    <div class="download-content flex-fill">
      <download-dashboard-header v-if="data.page === 1" />
      <div class="page-content">
        <div class="title d-flex align-items-end">
          <h1 class="font-weight-bolder text-dark my-0">
            {{ data.title }}
          </h1>
          <span>
            Halaman {{ data.page }} dari {{ data.total }}
          </span>
        </div>
        <div>
          <download-dashboard-kompetitor
            v-if="data.id === 1"
            :page="data.page"
          />
          <download-dashboard-statistic
            v-else-if="data.id === 2"
            :page="data.page"
          />
          <download-dashboard-post
            v-else-if="data.id === 3"
            :page="data.page"
          />
        </div>
      </div>
    </div>
    <div class="download-footer d-flex justify-content-between align-items-center w-100">
      <div class="d-flex align-items-center">
        <span class="font-weight-bolder">
          Toba.AI
        </span>
        <div class="vl" />
        <span class="footer-detail">
          Cekbrand
        </span>
        <div class="vl" />
        <span class="footer-detail">
          Kompetitor
        </span>
        <div class="vl" />
        <span class="footer-detail">
          widya.analytic ({{ resolveDateRange() }})
        </span>
        <div class="vl" />
        <span class="footer-detail">
          Exported: {{ exportedDateTime() }}
        </span>
      </div>
      <div>
        <span class="footer-detail">
          Halaman {{ data.page }} dari  {{ data.total }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { BCard, BImg } from 'bootstrap-vue'

import DownloadDashboardHeader from './DownloadDashboardHeader'
import DownloadDashboardKompetitor from './DownloadDashboardKompetitor'
import DownloadDashboardStatistic from './DownloadDashboardStatistic'
import DownloadDashboardPost from './DownloadDashboardPost'

import useDownloadDashboard from './useDownloadDashboard'
import useDateFilter from '../cekbrand-dashboard/components/useDateFilter'

export default {
  components: {
    BCard,
    BImg,
    DownloadDashboardHeader,
    DownloadDashboardKompetitor,
    DownloadDashboardStatistic,
    DownloadDashboardPost,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup (props, context) {
    const {
      exportedDateTime
    } = useDownloadDashboard(props, context)
    const {
      // UI
      resolveDateRange
    } = useDateFilter(props, context)


    return {
      exportedDateTime,
      resolveDateRange
    }
  }
}
</script>

<style lang="scss">
#download-dashboard-container {
  width: 1440px;
  height: 2038px;
  position: relative;

  .download-header {
    height: 80px;
    padding: 0px 120px;

    & > div {
      padding: 20px 0px;
    }
    & > hr {
      border-top: 1px solid #E9EAEB;
    }
  }
  .download-content {
    padding: 24px 120px;
    .page-content {
      .title {
        margin-bottom: 24px;

        h1 {
          font-size: 36px;
          line-height: 40px;
          margin-right: 16px;
        }
        span {
          font-size: 16px;
          line-height: 24px;
        }
      }
    }
  }
  .download-footer {
    position: absolute;
    bottom: 0;
    padding: 12px 36px 17px 36px;
    .vl {
      border-left: 1px solid #C9CBCD;
      height: 24px;
      margin: 0px 8px
    }
    .footer-detail {
      font-size: 13px;
      line-height: 16px;
    }
  }
}
</style>
