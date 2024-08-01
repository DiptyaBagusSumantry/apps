<template>
  <div>
    <!-- toast -->
    <b-toast
      v-ripple.400="'rgba(40, 199, 111, 0.15)'"
      id="toast-notification"
      toaster="b-toaster-top-center"
      solid
      no-auto-hide
      no-close-button
      no-hover-pause
    >
      <template #toast-title>
        <div class="d-flex flex-grow-1 align-items-center mr-25 mt-1">
          <feather-icon
            class="mr-1"
            icon="BellIcon"
            width="16.67px"
            height="16.67px"
            stroke="#4ced0c"
          />
          <strong>Notifikasi</strong>
        </div>
      </template>
      <span v-if="!downloadOnProcess">
        Dokumen anda akan terunduh dalam {{ countDown }}
      </span>
      <div
        v-else
        class="w-100 d-flex justify-content-around align-items-center"
      >
        <b-spinner
          variant="success"
          type="grow"
          label="Spinning"
        />
        <span>Sedang proses mendownload</span>
        <b-spinner
          variant="success"
          type="grow"
          label="Spinning"
        />
      </div>
    </b-toast>
    <!-- toast end -->

    <div
      id="download-dashboard"
      v-if="activeAccountData.id"
    >
      <div class="download-overlay w-100 h-100" />
      <div
        class="download-dashboard-container"
        ref="refDashboardKompetitor"
        v-if="page.includes('1')"
      >
        <!-- For Kompetitor Page -->
        <div
          v-for="index in 2"
          :key="index"
        >
          <download-dashboard-container
            :data="{
              id: 1,
              title: 'Kompetitor',
              page: index,
              total: 2
            }"
          />
        </div>
      </div>

      <div
        class="download-dashboard-container"
        ref="refDashboardStatistics"
        v-if="page.includes('2')"
      >
        <!-- For Statistic Page -->
        <div
          v-for="index in 4"
          :key="index"
        >
          <download-dashboard-container
            :data="{
              id: 2,
              title: 'Statistik',
              page: index,
              total: 4
            }"
          />
        </div>
      </div>

      <div
        class="download-dashboard-container"
        v-if="page.includes('3')"
      >
        <!-- For Top Post Page -->
        <div
          v-for="index in 5"
          :key="index"
          :ref="`refDashboardTopPost${index}`"
        >
          <download-dashboard-container
            :data="{
              id: 3,
              title: 'Top Post',
              page: index,
              total: 5
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from '@vue/composition-api'
import { BSpinner, BToast } from 'bootstrap-vue'
import { saveAs } from 'file-saver'
import { useRouter } from '@core/utils/utils'
import VueHtml2pdf from 'vue-html2pdf'
import html2pdf from 'html2pdf.js'
import JSZip from 'jszip'
import store from '@/store'
import Ripple from 'vue-ripple-directive'

import DownloadDashboardContainer from './DownloadDashboardContainer'

import useDownloadDashboard from './useDownloadDashboard'

export default {
  components: {
    DownloadDashboardContainer,
    VueHtml2pdf,
    BSpinner,
    BToast,
  },
  directives: {
    Ripple,
  },
  setup (props, context) {
    const {
      activeAccountData,
      dateFilter,
      // Methods
      setUserActiveAccount,
    } = useDownloadDashboard(props, context)

    const { route } = useRouter()
    const { page, username } = route.value.params
    const refDashboardKompetitor = ref()
    const refDashboardStatistics = ref()
    const downloadOnProcess = ref(false)
    const countDown = ref(30)
    const options = ref({
      filename: 'downloadDashboard',
      html2canvas: {
        scale: 2,
        useCORS: true,
        width: 1440,
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        hotfixes: ['px_scaling'],
        orientation: 'portrait'
      }
    })

    const generateReport = () => {
      downloadOnProcess.value = true
      let zip = new JSZip()
      if (page.includes('1')) {
        zip.file(
          'DashboardKompetitor.pdf',
          html2pdf()
            .from(refDashboardKompetitor.value)
            .set(options.value)
            .output('blob')
        )
      }
      if (page.includes('2')) {
        zip.file(
          'DashboardStatistics.pdf',
          html2pdf()
            .from(refDashboardStatistics.value)
            .set(options.value)
            .output('blob')
        )
      }
      if (page.includes('3')) {
        for (let i = 1; i <= 5; i++) {
          zip.file(
            `DashboardTopPost-page${i}.pdf`,
            html2pdf()
              .from(context.refs[`refDashboardTopPost${i}`][0])
              .set(options.value)
              .output('blob')
          )
        }
      }
      zip
        .generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 9 }
        })
        .then(res => saveAs(res, "AnalyticsDashboard.zip"))
        .finally(() => {
          context.root.$bvToast.hide('toast-notification')
          downloadOnProcess.value = false
        })
    }

    const countDownTimer = () => {
      if (countDown.value > 0) {
        setTimeout(() => {
          countDown.value -= 1
          countDownTimer()
        }, 1000)
      }
    }
    onMounted(() => {
      const appLoading = document.getElementById('loading-bg')
      appLoading.style.display = 'block'

      store.commit('cekbrand/UPDATE_DATE_FILTER', dateFilter)
      setUserActiveAccount(username)
        .then(() => {
          appLoading.style.display = 'none'
          context.root.$bvToast.show('toast-notification')
          countDownTimer()
          setTimeout(() => generateReport(), countDown.value * 1000)
        })
    })

    onUnmounted(() => {
      localStorage.removeItem('dateFilter')
      localStorage.removeItem('competitorList')
    })

    return {
      activeAccountData,
      refDashboardKompetitor,
      refDashboardStatistics,
      downloadOnProcess,
      countDown,
      options,
      page
    }
  }
}
</script>

<style lang="scss">
#download-dashboard {
  position: relative;

  .download-overlay {
    position: absolute;
    top: 0;
    z-index: 10;
  }
  .download-dashboard-container {
    width: fit-content;
    background: white;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
