<template>
  <swiper
    class="swiper-navigations px-sm-3 pt-sm-2"
    :options="swiperOptions"
    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
  >
    <swiper-slide v-for="(item, index) in swiperItems" :key="index">
      <header class="d-flex flex-column align-items-center px-1 px-sm-2">
        <h1
          class="font-weight-bolder text-black mb-2 line-height-condensed"
          :class="{'w-50': $store.state.app.windowWidth >= $themeBreakpoints.xl}"
        >
          Arsipkan report performamu dengan fitur
          <div
            class="d-inline-flex align-items-center bg-primary font-weight-bolder text-white px-1 py-50"
            style="border-radius:0.358rem"
          >
            <feather-icon icon="DownloadIcon" size="26" />
            <span class="font-medium-2 text-white ml-50">Export</span>
          </div>
        </h1>
        <h4
          class="font-medium-2 text-black line-height-condensed"
          :class="{'w-50': $store.state.app.windowWidth >= $themeBreakpoints.xl}"
        >
          Berlangganan dengan paket <strong class="text-pink">6-Bulan</strong> dan <strong class="text-pink">12-Bulan</strong> untuk mengakses fitur Export sebagai file CSV, PDF, ataupun XLSX
        </h4>
      </header>

      <div class="d-flex flex-row flex-wrap flex-xl-nowrap text-left mt-2 mt-lg-5">
        <div class="d-flex flex-column p-1 p-lg-3 mb-2 mb-lg-0">
          <h5 class="font-weight-normal text-gray-500">Export sebagai</h5>
          <h4 class="font-weight-bolder text-primary text-uppercase">{{ item.name }}</h4>
          <p
            class="font-small-3 mt-1 text-black"
            v-html="item.description"
          />
          <div class="mt-auto">
            <b-button
              block
              variant="gradient-pink"
              class="shadow-sm"
              :href="`${storeURL}/product/1/subscription-plan`"
              target="_blank"
            >
              <span class="text-white">Upgrade Plan</span>
            </b-button>
          </div>
        </div>
        <div class="px-xl-3">
          <b-img
            :src="require(`@/assets/images/pages/cekbrand/dashboard/${item.imageFile}`)"
            class="h-auto"
            :class="{'w-100': $store.state.app.windowWidth < $themeBreakpoints.xl}"
          />
        </div>
      </div>
    </swiper-slide>

    <!-- Add Arrows -->
    <div slot="button-next" class="swiper-button-next" />
    <div slot="button-prev" class="swiper-button-prev" />
    <div slot="pagination" class="swiper-pagination" />
  </swiper>

</template>

<script>
// import 'swiper/css/swiper.css'
import 'swiper/swiper-bundle.css'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { BImg, BButton } from 'bootstrap-vue'
import { $themeBreakpoints } from '@themeConfig'

export default {
  components: {
    Swiper,
    SwiperSlide,
    BImg,
    BButton,
  },
  computed: {
    storeURL() {
      return `${process.env.VUE_APP_WAS_SITE_URL}/#/store`
    },
  },
  data() {
    return {
      swiperOptions: {
        spaceBetween: 100,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      swiperItems: [
        {
          name: 'csv',
          description: 'Export reportmu sebagai <strong class=\'text-primary\'><em>CSV (Comma-Separated Values)</em></strong> yang dengan mudah kamu buka kembali dengan program spreadsheet seperti <strong>Microsoft Excel</strong> atau <strong>Google Spreadsheets</strong> atau bisa juga gunakan sebagai data raw yang bisa kamu olah lagi.',
          imageFile: 'download-demo-csv.png',
        },
        {
          name: 'pdf',
          description: 'Export reportmu sebagai <strong class=\'text-primary\'><em>PDF (Portable Document Format)</em></strong> untuk mempermudah menganalisis performa akunmu dan dengan mudah dapat kamu buka kembali dengan program seperti <strong>Adobe Reader</strong> atau <strong>Google Chrome</strong>.',
          imageFile: 'download-demo-pdf.png',
        },
        {
          name: 'xlsx',
          description: 'Export reportmu sebagai <strong class=\'text-primary\'><em>XLSX</em></strong> untuk mempermudah pengarsipan performa akunmu ke dalam sajian tabel serta dengan mudah kamu buka kembali dengan program spreadsheet seperti <strong>Microsoft Excel</strong> or <strong>Google Spreadsheets</strong>.',
          imageFile: 'download-demo-xlx.png',
        },
      ],
    }
  },
  setup() {
    return {
      // UI
      $themeBreakpoints,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/base/bootstrap-extended/include'; // Components includes

.swiper {
  &-button {
    &-disabled {
      display: none;
    }

    &-next,
    &-prev {
      border-radius: 100%;
      background: $primary;
      width: 36px;
      height: 36px;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);

      &:after {
        font-size: 10px;
        font-weight: 600;
        color: white;
      }
    }

    &-next {
      right: 0px;

      &:after {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='0' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
      }
    }

    &-prev {
      left: 0px;

      &:after {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='0' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-left'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") !important;
      }
    }
  }
}
</style>
